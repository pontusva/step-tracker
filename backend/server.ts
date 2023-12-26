import fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';

dotenv.config();

const server = fastify();

server.register(fastifyPostgres, {
  connectionString: `postgres://${process.env.PGUSERNAME}:${process.env.PGPASSWORD}@localhost/${process.env.PGDATABASE}`,
});

server.after(async () => {
  try {
    const client = await server.pg.connect();
    console.log('Database connection established');
    client.release();
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
