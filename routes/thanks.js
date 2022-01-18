// setup instructions:
const express = require("express");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const { requireUserLoggedIn, requireUserSigned } = require("../middlewares.js");

const db = require("../db.js");

const router = express.Router();

// GET route:
router.get("/thanks", requireUserLoggedIn, requireUserSigned, (req, res) => {
    /*     console.log(
        "going to load signature from db with id:",
        req.session.signatureId
    ); */

    // here we need to ask the database (db) for the signature with the given signatureId
    // and pass the returned data url to the handlebars template

    db.countSignatures().then((resultCount) => {
        let signatureId = req.session.signatureId;
        db.getSignature(signatureId).then((result) => {
            console.log(
                "the user visits the '/thanks' page where his signature was loaded from the db."
            );
            res.render("thanks", {
                count: resultCount.rows[0].count,
                signature: result.rows[0].signature,
            });
        });
    });
});

// special POST to get to the signers page:
router.post("/signers", requireUserLoggedIn, requireUserSigned, (req, res) => {
    console.log(
        "the user visits was redirectes to the '/signers' page by cklicking the button 'see the list of signers' on the '/thanks' page."
    );
    res.redirect("/signers");
});

// special POST route to delete the user's signature again:
router.post("/delete/signature", (req, res) => {
    delete req.session.signatureId;
    db.deleteSignature(req.session.userId)
        .then(() => {
            console.log(
                "the user's signature was successfully deleted from the db and the user was redirected to the '/petition' page."
            );
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log(
                "something went wrong while deleting the user's signature:",
                err
            );
            res.render("thanks", { error: true });
        });
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
