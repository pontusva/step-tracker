export default {
  auth: {
    signUp: 'INSERT INTO users (uid, name) VALUES ($1, $2) RETURNING *',
  },
  sync: {
    syncSteps: `INSERT INTO steps (uid, date, step_count_day) 
      VALUES ($1, CURRENT_DATE, $2) 
      ON CONFLICT (uid, date) 
      DO UPDATE SET step_count_day = EXCLUDED.step_count_day 
      RETURNING *`,
  },
};
