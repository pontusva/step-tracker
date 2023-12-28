import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import queries from '../queries';

interface SignUp {
  Body: { uid: string; name: string; email: string };
}

interface SyncSteps {
  Body: { uid: string; steps: number };
}

interface SendFriendRequest {
  Body: { currentUserId: string; friendUId: string };
}

interface AcceptFriendRequest {
  Body: { currentUserId: string; friendUId: string };
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

  // write a route that handles the like query in queries.ts SELECT * FROM users WHERE email LIKE '%' || $1 || '%';
  fastify.get(
    '/search-user',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { searchParam } = request.query as { searchParam: string };
        console.log({ searchParam });
        if (!searchParam) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        const result = await fastify.pg.query(
          queries.friendRequests.searchByEmail,
          [`%${searchParam}%`]
        );

        if (result.rowCount === 0) {
          reply.code(500).send({ error: 'Failed to find user' });
          return;
        }

        return result.rows;
      } catch (error) {
        console.error(error);
        reply
          .code(500)
          .send({ error: 'An error occurred while searching for the user' });
      }
    }
  );

  fastify.post(
    '/send-friend-request',
    async (request: FastifyRequest<SendFriendRequest>, reply: FastifyReply) => {
      try {
        const { currentUserId, friendUId } = request.body;

        if (!currentUserId || !friendUId) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        await fastify.pg.query(queries.friendRequests.sendFriendRequest, [
          currentUserId,
          friendUId,
        ]);

        reply.code(200).send({ message: 'Friend request sent' });
      } catch (error) {
        console.error(error);
        reply.code(500).send({
          error: 'An error occurred while sending the friend request',
        });
      }
    }
  );
  fastify.get(
    '/pending-friend-requests',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = request.query as { userId: string };

        if (!userId) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        const { rows } = await fastify.pg.query(
          queries.friendRequests.getFriendRequests,
          [userId]
        );

        reply.code(200).send(rows);
      } catch (error) {
        console.error(error);
        reply.code(500).send({
          error: 'An error occurred while fetching the pending friend requests',
        });
      }
    }
  );

  fastify.post(
    '/accept-friend-request',
    async (
      request: FastifyRequest<AcceptFriendRequest>,
      reply: FastifyReply
    ) => {
      try {
        const { currentUserId, friendUId } = request.body;

        if (!currentUserId || !friendUId) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        const { rows } = await fastify.pg.query(
          queries.friendRequests.acceptFriendRequest,
          [currentUserId, friendUId]
        );

        reply.code(200).send({ message: 'Friend request accepted', rows });
      } catch (error) {
        console.error(error);
        reply.code(500).send({
          error: 'An error occurred while accepting the friend request',
        });
      }
    }
  );

  fastify.get(
    '/accepted-friend-requests/:userId',
    async (
      request: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { userId } = request.params;

        const { rows } = await fastify.pg.query(
          queries.friendRequests.getAcceptedFriendRequests,
          [userId]
        );

        reply.code(200).send(rows);
      } catch (error) {
        console.error(error);
        reply.code(500).send({
          error: 'An error occurred while fetching accepted friend requests',
        });
      }
    }
  );
}

export async function compareWithFriends(fastify: FastifyInstance) {
  fastify.get(
    '/compare-with-friends',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = request.query as { userId: string };
        console.log(userId);
        if (!userId) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        const { rows } = await fastify.pg.query(
          queries.compareWithFriends.getSteps,
          [userId]
        );

        reply.code(200).send(rows);
      } catch (error) {
        console.error(error);
        reply.code(500).send({
          error: 'An error occurred while fetching the steps',
        });
      }
    }
  );
}
