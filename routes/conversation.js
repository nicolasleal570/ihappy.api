const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const isLoggedIn = require("../utils/verifyProtectedRoutes");

// Get conversations filtering by the logged user
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const conversations = await Conversation.find({participants: user._id}).populate('participants')

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error " + err,
      });
    }
  }
});

// Create a conversation
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { participants, last_message, last_time } = req.body;

  const conversation = await Conversation.create({
    participants: [req.user, ...participants],
    last_message,
    last_time,
  });

  global.io.sockets.join(conversation._id);

  res.status(200).json({
    success: true,
    data: conversation
  });

  } catch (err) {
    res.status(500).json({
      success: true,
      error: err
    });    
  }
});

module.exports = router;
