// setup instructions:
const express = require("express");
const bcrypt = require("bcryptjs");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const { requireUserLoggedIn } = require("../middlewares.js");

const db = require("../db.js");

const router = express.Router();

// GET route:
router.get("/profile/edit", requireUserLoggedIn, (req, res) => {
    let userId = req.session.userId;
    db.getUsersProfile(userId).then((result) => {
        console.log(
            "the user might want to update his current profile:",
            result
        );
        res.render("edit", result.rows[0]);
    });
});

// other way to handle the GET request for "/profile/edit":
/* app.get("/profile/edit", (req, res) => {
    let userId = req.session.userId;
    db.getUsersProfil(userId).then((result) => {
        console.log(result);
        res.render("edit", {
            first: result.rows[0].first,
            last: result.rows[0].last,
            email: result.rows[0].email,
            age: result.rows[0].age,
            city: result.rows[0].city,
            url: result.rows[0].url,
        });
    });
}); */

// POST route for the 'update' button:
router.post("/profile/edit", requireUserLoggedIn, (req, res) => {
    if (req.body.password !== "") {
        const password = req.body.password;
        bcrypt
            .hash(password, 12)
            .then((digest) => {
                // we need the 'return' here to wait until this block is done
                return db.updateUserProfilewithPassword(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    digest,
                    req.session.userId
                );
            })
            .then(() => {
                if (req.body.age === "") {
                    let age = null;
                    return db.updateUserProfile(
                        age,
                        req.body.city,
                        req.body.url,
                        req.session.userId
                    );
                } else {
                    return db.updateUserProfile(
                        req.body.age,
                        req.body.city,
                        req.body.url,
                        req.session.userId
                    );
                }
            })
            .then(() => {
                console.log(
                    "the user successfully updated his profile and was redirected to the '/thanks' page."
                );
                res.redirect("/thanks");
            })
            .catch((err) => {
                console.log(
                    "something went wrong while editing user's profile:",
                    err
                );
                res.render("edit", { error: true });
            });
    } else {
        db.updateUserProfilewithoutPassword(
            req.body.first,
            req.body.last,
            req.body.email,
            req.session.userId
        )
            .then(() => {
                if (req.body.age === "") {
                    let age = null;
                    db.updateUserProfile(
                        age,
                        req.body.city,
                        req.body.url,
                        req.session.userId
                    );
                } else {
                    db.updateUserProfile(
                        req.body.age,
                        req.body.city,
                        req.body.url,
                        req.session.userId
                    );
                }
            })
            .then(() => {
                console.log(
                    "the user successfully updated his profile and was redirected to the '/thanks' page."
                );
                res.redirect("/thanks");
            })
            .catch((err) => {
                console.log(
                    "something went while editing user's profile:",
                    err
                );
                res.render("edit", { error: true });
            });
    }
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
