const jwt = require("jwt-simple");
const cookieParser = require("cookie-parser");

module.exports = function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(403).send({
        success: false,
        error: "You have to be logged in",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    const payload = jwt.decode(token, process.env.TOKEN_SECRET);

    req.user = payload.sub;
    next();
  } catch (err) {
    return res.status(401).send({
      success: false,
      error: "Token expire",
    });
  }
};
