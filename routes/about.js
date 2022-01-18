// setup instructions:
const express = require("express");

const router = express.Router();

// GET route:
router.get("/about", (req, res) => {
    console.log("the user visits the '/about' page.");
    res.render("about");
});

// POST route for the 'sign for the petition' button:
router.post("/about", (req, res) => {
    console.log("the user wants to vote for the petition.");
    res.redirect("/petition");
});

//  POST route for the 'read more' button:
router.post("/faq", (req, res) => {
    console.log("the user wants to know more about the petition.");
    res.redirect("/faq");
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
