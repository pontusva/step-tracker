import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import queries from '../queries';

interface SignUp {
  Body: { uid: string; name: string; email: string };
}

interface SyncSteps {
  Body: { uid: string; steps: number };
}

interface FriendRequest {
  Body: { user_uid: string; friend_uid: string };
}

interface GetFriendRequest {
  Body: { uid: string };
}

export async function routes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return { hello: 'world' };
  });

  fastify.post('/', async (request, reply) => {
    reply.code(201).send({ hello: 'world' });
  });

  fastify.post(
    '/sync-steps',
    async (request: FastifyRequest<SyncSteps>, reply: FastifyReply) => {
      const { uid, steps } = request.body;
      try {
        const result = await fastify.pg.query(queries.sync.syncSteps, [
          uid,
          steps,
        ]);
        if (result.rowCount === 0) {
          reply.code(500).send({ error: 'Failed to sync steps' });
          return;
        }
        return result.rows[0];
      } catch (error) {
        console.error(error);
        reply
          .code(500)
          .send({ error: 'An error occurred while syncing steps' });
      }
    }
  );
}

export async function auth(fastify: FastifyInstance) {
  fastify.post(
    '/auth/signup',
    async (request: FastifyRequest<SignUp>, reply: FastifyReply) => {
      try {
        const { uid, name, email } = request.body;

        if (!uid || !name) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        const result = await fastify.pg.query(queries.auth.signUp, [
          uid,
          name,
          email,
        ]);

        if (result.rowCount === 0) {
          reply.code(500).send({ error: 'Failed to create user' });
          return;
        }

        return result.rows[0];
      } catch (error) {
        console.error(error);
        reply
          .code(500)
          .send({ error: 'An error occurred while creating the user' });
      }
    }
  );
}

// Write a post method that accepts a user_uid and friend_uid and updates the friendship status to 'ACCEPTED'

// Write a get method that accepts a user_uid and returns all friends for that user
