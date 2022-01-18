const spicedPg = require("spiced-pg");

// to create database named petition you need to run "createdb petition" once

// old code to access the secret keys
// progress_ YOUR_USERNAME:YOUR_PASSWORD@LOCALHOST:5432/DB_NAME
// const { connectionString } = require("./secrets.json");

// new code to access the secret keys (to make it available for heroku)
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    connectionString = require("./secrets.json").connectionString;
}

const db = spicedPg(connectionString);

// asyncron query method (old try)
/* db.query(`SELECT * FROM petition`).then((result) => {
    console.log(result.rows);
}); */

// we are interested in the array of result.rows
module.exports.getSignatures = () => {
    return db.query(
        `SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users JOIN signatures ON signatures.user_id = users.id
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id ORDER BY last;`
    );
};

module.exports.addSignature = (signature, userId) => {
    // NEVER EVER use the string interpolation in template literals
    // to construct your SQL queries.
    // Always use the built-in $1, $2... syntax
    return db.query(
        `INSERT INTO signatures (signature, user_id) 
        VALUES ($1, $2)
        RETURNING id;`,
        [signature, userId]
    );
};

module.exports.countSignatures = () => {
    return db.query("SELECT COUNT(id) as count FROM signatures;");
};

module.exports.getSignature = (signatureId) => {
    return db.query(`SELECT signature FROM signatures WHERE id = $1;`, [
        signatureId,
    ]);
};

module.exports.addUser = (first, last, email, digest) => {
    return db.query(
        `INSERT INTO users (first, last, email, digest) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;`,
        [first, last, email, digest]
    );
};

module.exports.getUser = (userId) => {
    return db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
};

module.exports.getUserEmail = (email) => {
    return db.query(
        `SELECT users.*, signatures.id AS signatureid FROM users LEFT JOIN signatures ON users.id = signatures.user_id  WHERE email = $1;`,
        [email]
    );
};

module.exports.insertUser = (age, city, url, userId) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;`,
        [age, city, url, userId]
    );
};

module.exports.getSignersByCity = (city) => {
    return db.query(
        `SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users JOIN signatures ON signatures.user_id = users.id
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE LOWER(city) = LOWER($1);`,
        [city]
    );
};

module.exports.getUsersProfile = (userId) => {
    return db.query(
        `SELECT users.first, users.last, users.email, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users FULL OUTER JOIN user_profiles ON users.id = user_profiles.user_id
        WHERE users.id = $1;`,
        [userId]
    );
};

module.exports.updateUserProfilewithPassword = (
    first,
    last,
    email,
    digest,
    userId
) => {
    return db.query(
        `UPDATE users SET first=$1, last=$2, email=$3, digest=$4
        WHERE id = $5;`,
        [first, last, email, digest, userId]
    );
};

module.exports.updateUserProfilewithoutPassword = (
    first,
    last,
    email,
    userId
) => {
    return db.query(
        `UPDATE users SET first=$1, last=$2, email=$3
        WHERE id = $4;`,
        [first, last, email, userId]
    );
};

module.exports.updateUserProfile = (age, city, url, userId) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age=$1, city=$2, url=$3;`,
        [age, city, url, userId]
    );
};

module.exports.deleteSignature = (userId) => {
    return db.query(
        `DELETE FROM signatures
        WHERE user_id = $1;`,
        [userId]
    );
};
