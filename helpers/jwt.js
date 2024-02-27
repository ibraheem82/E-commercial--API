const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [ 
      { url: /\/api\/v1\/(products|categories)(.*)/, methods: ['GET', 'OPTIONS'] }, 
      { url: `${api}/users/login` }, // Using template literal for clarity
      { url: `${api}/users/register` }, 
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    try {
      const isTokenRevoked = await checkDatabaseForRevocation(payload.tokenId); // Replace with actual logic
      done(null, isTokenRevoked);
    } catch (error) {
      done(error); 
    }
  } else {
    done(); 
  }
}

module.exports = authJwt;
