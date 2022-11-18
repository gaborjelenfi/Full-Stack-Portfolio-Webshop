const jwt = require('jsonwebtoken');
require('dotenv/config');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAdminAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
  } catch (err) {
    req.isAdminAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAdminAuth = false;
    return next();
  }
  req.adminId = decodedToken.adminId;
  req.isAdminAuth = true;
  next();
};
