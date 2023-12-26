import { FastifyInstance } from 'fastify';

const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' },
        },
      },
    },
  },
};

export default async function routes(fastify: FastifyInstance) {
  fastify.get('/', opts, async () => {
    return { hello: 'world' };
  });

  fastify.post('/', opts, async (request, reply) => {
    reply.code(201).send({ hello: 'world' });
  });
}
