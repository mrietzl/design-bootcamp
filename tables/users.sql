-- createdb petition
-- psql -d petition -f tables/users.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f tables/users.sql  

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d petition -f tables/users.sql)

DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

--- the id from this users table will be the field, that unifies ALL our tables
CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR NOT NULL CHECK (first != ''),
      last VARCHAR NOT NULL CHECK (last != ''),
      email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
      digest VARCHAR NOT NULL CHECK (digest != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

SELECT * FROM users;

