// middlewares always have three arguments:
// request, response and next()

// if the user is already registered and logged in,
// we will redirect him to the 'petition' page
module.exports.requireUserNotLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        console.log(
            "the user was redirected to '/petition' because he is already registered and logged in."
        );
        return res.redirect("/petition");

        // eather you write one middleware for each redirect, or …
        // … you can react to the requested url from within your middleware
        /*if (req.url === "/login") {
            return res.redirect("/thanks");
        } else {
            return res.redirect("/petition");
        }*/
    }

    next();
};

// if the user is not registered and logged in yet,
// we will redirect him to the 'register' page
module.exports.requireUserLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        console.log(
            "the user was redirected to '/register' because he is not registered yet."
        );
        return res.redirect("/register");
    }

    next();
};

// if the user has not signed yet,
// we will redirect him to the 'petition' page to sign for the petition
module.exports.requireUserSigned = (req, res, next) => {
    if (!req.session.signatureId) {
        console.log(
            "the user was redirected to '/petition' because he has not signed yet."
        );
        return res.redirect("/petition");
    }

    next();
};

// if the user has already signed for the petition,
// we will redirect him to the 'thanks' page
module.exports.requireUserNotSigned = (req, res, next) => {
    if (req.session.signatureId) {
        console.log(
            "the user was redirected to '/thanks' because he has already signed for the petition."
        );
        return res.redirect("/thanks");
    }

    next();
};
