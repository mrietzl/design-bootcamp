-- createdb petition
-- psql -d petition -f tables/signatures.sql

-- changes within the tables must be updated in heroku with:
-- heroku pg:psql -f tables/signatures.sql

-- whenever we change the sql file,
-- we need to run the psql command above again! (psql -d petition -f tables/signatures.sql)

DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    -- do not use upper case characters for the definition of rows …
    -- … and try to avoid more than one words (in case: first_name is ok)
      id SERIAL PRIMARY KEY,
      signature VARCHAR NOT NULL CHECK (signature != ''),
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- here we are adding the foreign key (user_id)
-- foreign key lets us identify which user from the users table signed the petition
-- and which signature is theirs (acts as an identifier between the 2 tables!)

SELECT * FROM signatures;

