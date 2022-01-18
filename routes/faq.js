// setup instructions:
const express = require("express");

const router = express.Router();

// GET route:
router.get("/faq", (req, res) => {
    console.log("the user visits the '/faq' page.");
    res.render("faq");
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
