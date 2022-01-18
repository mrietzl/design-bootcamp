// setup instructions:
const express = require("express");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const { requireUserLoggedIn } = require("../middlewares.js");

const router = express.Router();

// POST route:
router.post("/logout", requireUserLoggedIn, (req, res) => {
    delete req.session.signatureId;
    delete req.session.userId;
    console.log(
        "the user has logged out and was redirected to the '/login' page."
    );
    res.redirect("/login");
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
