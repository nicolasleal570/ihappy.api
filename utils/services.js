const jwt = require('jwt-simple');
const moment = require('moment');

module.exports = function (user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, "hours").unix(),
    };
    return jwt.encode(payload, process.env.TOKEN_SECRET);
}