const express = require('express');
const router = express.Router();
const Conversations = require('../models/Conversations');

router.get('/', function (req, res) {
  res.send('Hello Conversations');
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
        id_psicologo,
        id_usuario,
        last_message,
        last_time
    } = req.body

    const conversations = await Conversations.create({
        id_psicologo,
        id_usuario,
        last_message,
        last_time
    });

    return res.status(200).json({
      success: true,
      data: conversations
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

});
module.exports = router;