// setup instructions:
const express = require("express");

// because we import a file of a parent folder here …
// … we need the .. before the file's name!
const {
    requireUserLoggedIn,
    requireUserNotSigned,
} = require("../middlewares.js");

const db = require("../db.js");

const router = express.Router();

// GET route:
router.get(
    "/petition",
    requireUserLoggedIn,
    requireUserNotSigned,
    (req, res) => {
        console.log("the user visits the '/petition' page.");
        res.render("petition");

        // the old way how i did it …
        // but now we use middleware locig to DRY!
        /*         if (req.session.userId && req.session.signatureId) {
            console.log(
                " … and was redirected to '/thanks', because he/she already registered and signed the petition."
            );
            return res.redirect("/thanks");
        } else if (!req.session.signatureId && req.session.userId) {
            console.log(
                " … and the 'petition'-template was rendered, because he/she already registered but not signed the petition yet."
            );
            return res.render("petition");
        } else {
            console.log(
                " … and was redirected to '/register', because he/she did not registered yet."
            );
            res.redirect("/register");
        } */
    }
);

// POST route for the 'submit' button:
// curl -X POST -d "first=ma&last=mustermann&signature=mm" http://localhost:3000/petition (to test)
router.post(
    "/petition",
    requireUserLoggedIn,
    requireUserNotSigned,
    (req, res) => {
        const { signature } = req.body;

        db.addSignature(signature, req.session.userId)
            .then((result) => {
                // if we end up in the then block,
                // insert has been successful
                // console.log("the users id is", result.rows[0].id);
                req.session.signatureId = result.rows[0].id;
                console.log(
                    "the user successfully signed the petition and was redirected to the '/thanks' page."
                );
                res.redirect("/thanks");
            })
            .catch((err) => {
                console.log(
                    "something went wrong while signing the petition:",
                    err
                );
                res.render("petition", { error: true });
            });
    }
);

//  POST route for the 'read more' button:
router.post("/faq", (req, res) => {
    console.log("the user wants to know more about the petition.");
    res.redirect("/faq");
});

// we need to export the middleware module here …
// … to get access in the server.js again.
module.exports = router;
