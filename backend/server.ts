import fastify from 'fastify';
import dotenv from 'dotenv';
import { routes, auth, friendRequest } from './routes/routes';
import cors from '@fastify/cors';
import dbConnection from './connections/db-connection';
dotenv.config();

const server = fastify();

server.register(cors);
server.register(dbConnection);
server.register(routes);
server.register(friendRequest);
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

server.listen({ port: 5000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
