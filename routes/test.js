const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

router.get('/', function (req, res) {
    res.send('Hello test');
  });

  router.post('/', async (req, res) => {

    try {
      // Destructuring de lo que manda el usuario
      const {
        title,
        question
      } = req.body
  
      const test = await Test.create({
        title,
        question
      });
  
      return res.status(200).json({
        success: true,
        data: test
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