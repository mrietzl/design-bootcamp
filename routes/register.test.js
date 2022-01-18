const supertest = require("supertest");

// jest automagically loads the mocked version for us.
// __mocks__/cookie-session.js
const cookieSession = require("cookie-session");

const app = require("../server.js");

test("exercise 2: users who are logged in are redirected to the petition page when they attempt to go to the registration page", () => {
    // we need a mock of the cookie-session here:
    cookieSession.mockSession({
        userId: 341,
    });

    return supertest(app)
        .get("/register")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});
