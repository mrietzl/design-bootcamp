const supertest = require("supertest");

// jest automagically loads the mocked version for us.
// __mocks__/cookie-session.js
const cookieSession = require("cookie-session");

const app = require("../server.js");
// const router = require("./petition.js");

test("exercise 1: users who are logged out are redirected to the registration page when they attempt to go to the petition page", () => {
    return supertest(app)
        .get("/petition")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/register");
        });
});

test("exercise 3: users who are logged in and have signed the petition are redirected to the thank you page when they attempt to go to the petition page or submit a signature", () => {
    // we need a mock of the cookie-session here:
    cookieSession.mockSession({
        userId: 341,
        signatureId: 402,
    });

    return supertest(app)
        .get("/petition")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/thanks");
        });
});
