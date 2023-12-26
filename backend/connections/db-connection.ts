import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyPostgres from '@fastify/postgres';

async function dbConnector(fastify: FastifyInstance) {
  fastify.register(fastifyPostgres, {
    url: 'mongodb://localhost:27017/test_database',
  });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(dbConnector);
