export default {
  auth: {
    signUp: 'INSERT INTO users (uid, name) VALUES ($1, $2) RETURNING *',
  },
  sync: {
    syncSteps:
      'INSERT INTO steps (uid, step_count_day) VALUES ($1, $2) RETURNING *',
  },
};
