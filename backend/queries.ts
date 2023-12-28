export default {
  auth: {
    signUp:
      'INSERT INTO users (uid, name, email) VALUES ($1, $2, $3) RETURNING *',
  },
  sync: {
    syncSteps: `INSERT INTO steps (uid, date, step_count_day) 
                  VALUES ($1, CURRENT_DATE, $2) 
                  ON CONFLICT (uid, date) 
                  DO UPDATE SET step_count_day = EXCLUDED.step_count_day 
                  RETURNING *`,
  },
  // write a query that finds all registred users
  friendRequests: {
    searchByEmail: `SELECT * FROM users WHERE email LIKE '%' || $1 || '%';`,
    sendFriendRequest: `INSERT INTO friendships (user_uid, friend_uid, status, action_user_uid) VALUES ($1, $2, 'PENDING', $1);`,
    getFriendRequests: `SELECT users.name, friendships.*
    FROM friendships
    JOIN users ON friendships.user_uid = users.uid
    WHERE friendships.friend_uid = $1 AND friendships.status = 'PENDING';`,
  },
};
