const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret, 
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      // You can access these endpoints without authorization, or the use of JWT , you dont need jwt
      { url: /\/api\/v1\/products(.*)/ , method: ['GET', 'OPTIONS'] },
      {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,

    ]
  })
}


async function isRevoked(req, payload, done) {
  // If the user is not an admin, check if the token has been revoked.
  // For example, you might check a database or cache to see if the token is listed as revoked.
  // If the token is revoked, call done with true.
  // If the token is not revoked, call done with false.
  // If the user is an admin, call done with false to allow access.
  if (!payload.isAdmin) {
    // Replace this with your actual logic to check if the token is revoked.
    const isTokenRevoked = false; // This should be determined based on your application's logic.
    done(null, isTokenRevoked);
  } else {
    done(); // No need to check for revocation, allow access.
  }
}
module.exports = authJwt;