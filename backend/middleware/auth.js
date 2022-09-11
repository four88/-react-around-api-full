const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Authorization Error' });
};

// for checking authorization token from frontend
// Have user has token or not ?
const extractBearerToken = (header) => {
  return header.replace('Bearer ', '')
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // adding the payload to the Request object

  next(); // passing the request further along
};
