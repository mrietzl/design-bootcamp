// setup instructions:
const express = require("express");
const bcrypt = require("bcryptjs");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const db = require("../db.js");
const { requireUserNotLoggedIn } = require("../middlewares.js");

const router = express.Router();

// GET route:
router.get("/register", requireUserNotLoggedIn, (req, res) => {
    console.log("the user visits the '/register'page.");
    res.render("register");
});

// POST route for the 'register' button:
// curl -X POST -d "password=test" localhost:3000/register (to test)
router.post("/register", requireUserNotLoggedIn, (req, res) => {
    // this is the plaintext password
    const password = req.body.password;

    let last = req.body.last.toUpperCase() + req.body.last.slice(1);
    let first = req.body.first.toUpperCase() + req.body.first.slice(1);

    // we want to hash the password
    // before storing it in the DB.
    // NEVER EVER store the plaintext password!
    // 2 beneftis of bcrypt:
    // - designed to be slow
    // - salting built-in
    // bcrypt will automagically generate and use a random salt for every password
    // 12 is the difficulty -> the higher the slower
    bcrypt
        .hash(password, 12)
        .then((digest) => {
            // digest = hashed password
            // that's what we want to store in the database
            // e.g. : $2a$12$rXtdmRtk2L0qlZMukXseleV1fltSIoMSO9AwGMeTSnqFGG/drcbu2
            // console.log("digest:", digest);

            return db.addUser(first, last, req.body.email, digest);
        })
        .then((result) => {
            req.session.userId = result.rows[0].id;
            console.log(
                "a new user was set to the bd and the he was redirected to the '/petition' page."
            );
            res.redirect("/profile");
        })
        .catch((err) => {
            console.log(
                "something went wrong during the registration process:",
                err
            );
            res.render("register", { error: true });
        });
});

//  POST route for the 'login' button:
router.post("/get/login", (req, res) => {
    console.log(
        "the user wants to login and was be redirected to the '/login' page."
    );
    res.redirect("/login");
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
