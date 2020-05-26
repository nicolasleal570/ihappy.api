const express = require('express');
const router = express.Router();
const Choice = require('../models/Choice');

router.get('/', function (req, res) {
    res.send('Hello Choice');
  });

  router.post('/', async (req, res) => {

    try {
      // Destructuring de lo que manda el usuario
      const {
        answer,
        value
      } = req.body
  
      const choice = await Choice.create({
        answer,
        value
      });
  
      return res.status(200).json({
        success: true,
        data: choice
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