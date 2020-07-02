const jwt = require("jwt-simple");
const cookieParser = require("cookie-parser");
const Session = require("../models/Session");

module.exports = async function (req, res, next) {
  try {
    const { token: tokenCookie } = req.cookies;
    const session = await Session.findOne({
      token: tokenCookie,
      status: "valid",
    });

    if (!session) {
      res.clearCookie("token");
      return res.status(200).send({
        success: false,
        error: "Your session has expired.",
      });
    }
    req.session = session;
    req.user = session.userId
    // const token = req.headers.authorization.split(" ")[1];

    // const payload = jwt.decode(token, process.env.TOKEN_SECRET);

    // req.user = payload.sub;
    next();
  } catch (err) {
    return res.status(401).send({
      success: false,
      error: "Token expire",
    });
  }
};
