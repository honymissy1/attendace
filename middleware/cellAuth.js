const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const token = req.cookies.cellAdmin
  if (!token) {
    return res.status(403).redirect('/cellAdmin');
  }
  try {
    const decoded = jwt.verify(token, 'ouradminsecretissafer');
    req.user = decoded;
  } catch (err) {
    return res.status(401).redirect('/cellAdmin');
  }
  return next();
};

module.exports = verifyToken;