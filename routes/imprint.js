// setup instructions:
const express = require("express");

const router = express.Router();

// GET route:
router.get("/imprint", (req, res) => {
    console.log("the user visits the '/imprint' page.");
    res.render("imprint");
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
