const jwt = require('jsonwebtoken');
const PortalError = require('./../error');

module.exports = function(req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.cookies.token;

  if (!token) {
    return next(PortalError.Unauthorized('Unauthorized!'));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: ["HS256"]});

    return next();
  } catch (err) {
    return next(PortalError.Unauthorized(err.message));
  }
}

/*
 *
 * CHECK AUTHORITHATION HEADER:
 * 
 */
// module.exports = function(req, res, next) {
//   if (req.method === 'OPTIONS') {
//     next();
//   }

//   try {
//     const token = req.headers.authorization.split(' ')[1]; // Bearer jdbfkjbsndfj

//     if (!token) {
//       return res.status(401).json({message: 'Unauthorized!'});
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = decoded;

//     next();
//   } catch (err) {
//     res.status(401).json({message: 'Unauthorized!'});
//   }
// }