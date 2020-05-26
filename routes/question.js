const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.get('/', function (req, res) {
  res.send('Hello Question');
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
        title,
        answers
    } = req.body

    const question = await Question.create({
      title,
      answers
    });

    return res.status(200).json({
      success: true,
      data: question
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