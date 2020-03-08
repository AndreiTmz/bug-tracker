const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  //preluare token din header
  const token = req.header("token");

  //verificare existenta token
  if (!token) {
    return res.status(401).json({ message: "No token / Authorization denied" });
  }

  //verificare validitate token
  try {
    const decoded = jwt.verify(token, "mysecrettoken");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "token invalid" });
  }
};
