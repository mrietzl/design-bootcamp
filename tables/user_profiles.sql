-- psql -d petition -f tables/user_profiles.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f tables/user_profiles.sql

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d petition -f tables/user_profiles.sql)

DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city TEXT,
    url TEXT,
    user_id INT REFERENCES users(id) NOT NULL UNIQUE -- unique means each user can only have 1 row
);

SELECT * FROM user_profiles;
