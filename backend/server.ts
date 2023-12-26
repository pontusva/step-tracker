import fastify from 'fastify';
import dotenv from 'dotenv';
import { routes, auth } from './routes/routes';
import dbConnection from './connections/db-connection';
dotenv.config();

const server = fastify();

server.register(routes);
server.register(dbConnection);
server.register(auth);

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
