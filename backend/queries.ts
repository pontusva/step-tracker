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
  friendRequest: {
    sendRequest: `INSERT INTO friendships (user_uid, friend_uid, status, action_user_uid)
      VALUES ($1, $2, 'PENDING', $1)
      RETURNING *`,
    acceptRequest: `UPDATE friendships
      SET status = 'ACCEPTED', action_user_uid = $1
      WHERE user_uid = $2 AND friend_uid = $1 AND status = 'PENDING'
      RETURNING *`,
    checkFriendship: `SELECT * FROM friendships
      WHERE user_uid = $1 AND friend_uid = $2 AND status = 'ACCEPTED'`,
  },
};
