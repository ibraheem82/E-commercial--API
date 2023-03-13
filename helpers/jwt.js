const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret, 
    algorithms: ['HS256']
  }).unless({
    path: [
      { url: '/api/v1/products', method: ['GET', 'OPTIONS'] },
      
      '/api/v1/users/login',
      '/api/v1/users/register',

    ]
  })
}
module.exports = authJwt;