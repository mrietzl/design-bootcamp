// this was for part 4 of the petition project …
// … and since part 5 we do not need this part anymore.
// but anyway i want to keep the code. :)

// setup instructions:
const express = require("express");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const { requireUserLoggedIn } = require("../middlewares.js");

const db = require("../db.js");

const router = express.Router();

// GET route:
router.get("/profile", requireUserLoggedIn, (req, res) => {
    console.log("the user visits the '/profile' page.");
    res.render("profile");
});

// POST route for the 'update' button:
router.post("/profile", requireUserLoggedIn, (req, res) => {
    let { age, city, url } = req.body;
    let userId = req.session.userId;
    console.log(req.body);

    if (url.match("http://") != null || url.match("https://") != null) {
        if (age === "") {
            age = null;
        }
        db.insertUser(age, city, url, userId)
            .then((result) => {
                // console.log("the users id is", result.rows[0].id);
                // req.session.userId = result.rows[0].id;
                console.log(
                    "the user successfully extended his profile and was redirected to the '/signers' page."
                );
                // not sure where to redirect the user after editing the profile
                res.redirect("/signers");
            })
            .catch((err) => {
                console.log(
                    "something went wrong during the process of extending the user's profile:",
                    err
                );
                res.render("profile", { error: true });
            });
    } else if (url === "") {
        url = null;
        res.redirect("/signers");
    } else {
        console.log("we do not trust the user's url input.");
        res.render("profile", { error: true });
    }
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
