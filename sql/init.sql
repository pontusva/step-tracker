CREATE TABLE users (
  uid VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE steps (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) REFERENCES users(uid),
  date DATE,
  step_count_week INT,
  step_count_day INT,
  UNIQUE(uid, date)
);

CREATE TABLE friendships (
  user_uid VARCHAR(255) REFERENCES users(uid),
  friend_uid VARCHAR(255) REFERENCES users(uid),
  PRIMARY KEY (user_uid, friend_uid)
);