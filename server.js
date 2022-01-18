// setup instructions:
const express = require("express");

const registerRouter = require("./routes/register.js");
const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
const petitionRouter = require("./routes/petition.js");
const profileRouter = require("./routes/profile.js");
const editRouter = require("./routes/edit.js");
const signersRouter = require("./routes/signers.js");
const thanksRouter = require("./routes/thanks.js");
const aboutRouter = require("./routes/about.js");
const faqRouter = require("./routes/faq.js");
const imprintRouter = require("./routes/imprint.js");

const app = express();
const path = require("path"); // core modules

const { engine } = require("express-handlebars");

// using cookies:
// the old 3rd party module:
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());
// the new way to handle the cookies:
const cookieSession = require("cookie-session");

// old code to access the secret keys
// const { secretKey } = require("./secrets.json");
// new code to access the secret keys (to make it available for heroku)
let secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
    secretKey = require("./secrets.json").secretKey;
}

app.engine(
    "handlebars",
    engine({
        // global helper functions so that the date is always up to date
        // we can use them from ALL templates
        helpers: {
            currentDate() {
                return new Date().getFullYear();
            },
        },
    })
);
app.set("view engine", "handlebars");

// serving all files / subdirectories from the public directory (css file etc.)
app.use(express.static(path.join(__dirname, "public")));

// will give us access to req.body
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(
    cookieSession({
        // as long as nobody know our session secret,
        // no one can tamper (change) their cookies.
        secret: secretKey,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: true, // prevents Cross Site Request Forgery (CSRF) attacks
    })
);

app.use((req, res, next) => {
    console.log("📢", req.method, req.url, req.session);

    next();
});

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");

    next();
});

app.use((req, res, next) => {
    res.locals.session = req.session;

    next();
});

app.use(registerRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(petitionRouter);
app.use(profileRouter);
app.use(editRouter);
app.use(signersRouter);
app.use(thanksRouter);
app.use(aboutRouter);
app.use(faqRouter);
app.use(imprintRouter);

// if the user only visits the main web page (http://localhost:3000) …
// … we will automacally redirect him to the register side …
// … for later we can think about another start page ?!
app.get("/", (req, res) => {
    console.log(
        "the user visited 'http://localhost:3000' and was redirected to the '/about' side."
    );
    res.redirect("/about");
});

// This will be true if we start our app with `node server.js` or `npm start`.
// This will be false if we run ourt tests with `npm test`
if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(
            "michèle's design-bootcamp petition is now running on https://design-bootcamp.herokuapp.com or http://localhost:3000"
        );
    });
}

// we need to export the module 'app' …
// … and import it in the testing files to make a testing (SuperTest)
module.exports = app;
