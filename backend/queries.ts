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
  compareWithFriends: {
    getSteps: `SELECT steps.*, users.name, users.email
    FROM users
    LEFT JOIN steps ON steps.uid = users.uid
    WHERE steps.uid = $1 AND steps.date = CURRENT_DATE;`,
  },

  friendRequests: {
    searchByEmail: `SELECT * FROM users WHERE email LIKE '%' || $1 || '%';`,
    sendFriendRequest: `INSERT INTO friendships (user_uid, friend_uid, status, action_user_uid) VALUES ($1, $2, 'PENDING', $1);`,
    getFriendRequests: `SELECT users.*, friendships.*
    FROM friendships
    JOIN users ON friendships.user_uid = users.uid
    WHERE friendships.friend_uid = $1 AND friendships.status = 'PENDING';`,
    acceptFriendRequest: `  WITH updated AS (
      UPDATE friendships 
      SET status = 'ACCEPTED', action_user_uid = $1 
      WHERE user_uid = $2 AND friend_uid = $1
      RETURNING *
    )
    INSERT INTO friendships (user_uid, friend_uid, status, action_user_uid)
    SELECT $1, $2, 'ACCEPTED', $1
    WHERE NOT EXISTS (
      SELECT 1 FROM friendships WHERE user_uid = $1 AND friend_uid = $2
    )
    RETURNING *;`,
    getAcceptedFriendRequests: `SELECT users.*, friendships.*
    FROM friendships
    JOIN users ON friendships.user_uid = users.uid
    WHERE friendships.friend_uid = $1 AND friendships.status = 'ACCEPTED';`,
  },
};
