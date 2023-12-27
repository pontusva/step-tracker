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
        console.log(uid, name);

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

export async function friendRequest(fastify: FastifyInstance) {
  fastify.get(
    '/emails',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { search } = request.query as { search: string };
      console.log(search);
      try {
        const result = await fastify.pg.query(
          'SELECT users.email, users.uid FROM users WHERE email LIKE $1',
          [`%${search}%`]
        );

        if (result.rowCount === 0) {
          reply.code(404).send({ error: 'No emails found' });
          return;
        }

        return result.rows;
      } catch (error) {
        console.error(error);
        reply
          .code(500)
          .send({ error: 'An error occurred while fetching emails' });
      }
    }
  );

  fastify.post(
    '/friend-request',
    async (request: FastifyRequest<FriendRequest>, reply: FastifyReply) => {
      try {
        const { user_uid, friend_uid } = request.body;
        if (!user_uid || !friend_uid) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        const result = await fastify.pg.query(
          queries.friendRequest.sendRequest,
          [user_uid, friend_uid]
        );

        if (result.rowCount === 0) {
          reply.code(500).send({ error: 'Failed to send friend request' });
          return;
        }

        return result.rows[0];
      } catch (error) {
        console.error(error);
        reply
          .code(500)
          .send({ error: 'An error occurred while sending request' });
      }
    }
  );
}
