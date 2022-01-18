// setup instructions:
const express = require("express");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const { requireUserLoggedIn, requireUserSigned } = require("../middlewares.js");

const db = require("../db.js");

const router = express.Router();

// GET route:
// (all signers)
router.get("/signers", requireUserLoggedIn, requireUserSigned, (req, res) => {
    db.getSignatures().then((result) => {
        console.log("the user visits the '/signers' page with all signers.");
        /*         console.log(result);
         */ res.render("signers", {
            signers: result.rows,
            count: result.rows.length,
        });
    });
});

// GET route:
// (signers by city)
router.get(
    "/signers/:city",
    requireUserLoggedIn,
    requireUserSigned,
    (req, res) => {
        let city = req.params.city;
        db.getSignersByCity(city).then((result) => {
            console.log(
                "the user visits the '/signers' page with selected signers from " +
                    city +
                    "."
            );
            res.render("cities", {
                signers: result.rows,
                count: result.rows.length,
                city: city,
            });
        });
    }
);

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
