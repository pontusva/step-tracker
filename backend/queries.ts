export default {
  auth: {
    signUp: 'INSERT INTO users (uid, name) VALUES ($1, $2) RETURNING *',
  },
};
