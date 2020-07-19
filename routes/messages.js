const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const isLoggedIn = require('../utils/verifyProtectedRoutes');
const Message = require('../models/Message');

// Get conversations filtering by the logged user
// /api/messages/?conversation=<conversationID>
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const { conversation } = req.query;

    // TODO Validate if conversation exists

    const messages = await Message.find({ conversation })
      .populate('conversation')
      .lean();

    if (!conversation) {
      res.status(400).json({
        success: false,
        error: 'Conversation ID is required',
      });
    }

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error ' + err,
      });
    }
  }
});

// Create a new message
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { conversation, content } = req.body;

    const userId = req.user;

    let conver = await Conversation.findOne({
      _id: conversation,
      participants: userId,
    });

    if (!conver) {
      return res.status(400).json({
        success: true,
        error: "Conversation doesn't exists",
      });
    }

    const message = await Message.create({
      sender: req.user,
      content,
      conversation,
    });

    conver = await Conversation.findOneAndUpdate(
      {
        _id: conversation,
        participants: userId,
      },
      { last_message: content, last_time: Date.now() },
      { returnOriginal: false, useFindAndModify: false }
    ).populate('participants');

    // sending to all clients in 'conver._id' room, including sender
    global.io.sockets
      .in(conver._id)
      .emit('new message', { message, conversation: conver });

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error ' + err,
      });
    }
  }
});

module.exports = router;
