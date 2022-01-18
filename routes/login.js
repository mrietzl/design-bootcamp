// setup instructions:
const express = require("express");
const bcrypt = require("bcryptjs");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const db = require("../db.js");
const { requireUserNotLoggedIn } = require("../middlewares.js");

const router = express.Router();

// GET route:
router.get("/login", requireUserNotLoggedIn, (req, res) => {
    console.log("the user visits the '/login' page.");
    res.render("login");
});

// POST route for the 'login' button:
// curl -X POST -d "password=test" localhost:3000/login (to test)
router.post("/login", requireUserNotLoggedIn, (req, res) => {
    const email = req.body.email;

    db.getUserEmail(email).then((result) => {
        if (result.rows.length !== 0) {
            // this is the plaintext password
            const password = req.body.password;

            // we need to fetch the digest of the user
            // and compare it with the given e-mail from the DB

            bcrypt
                .compare(password, result.rows[0].digest)
                .then((match) => {
                    // if match true -> store userId in session (cookie) + redirect to '/petition'
                    if (match === true) {
                        /*                         console.log(result.rows[0]);
                         */ req.session.userId = result.rows[0].id;
                        console.log(
                            "the user successfully logged in and was redirected to the '/petition' page."
                        );
                        req.session.signatureId = result.rows[0].signatureid;
                        res.redirect("/petition");
                    }
                })
                // if match false -> send appropriate error message
                .catch((err) => {
                    console.log(
                        "something went wrong during the login process:",
                        err
                    );
                    res.render("login", { error: true });
                });
        } else {
            console.log("a user with the given email does not exist.");
            res.render("login", { error: true });
        }
    });
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
