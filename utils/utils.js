const Session = require("../models/Session");
const { model } = require("../models/Session");
const { models } = require("mongoose");

const initSession = async (userId) => {
  const token = await Session.generateToken();
  const csrfToken = await Session.generateToken();
  const session = await Session.create({ token, csrfToken, userId });

  return session;
};

module.exports = { initSession };
