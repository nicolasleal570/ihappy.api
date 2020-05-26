const express = require('express');
const router = express.Router();
const Specialty = require('../models/Specialty');

router.get('/', function (req, res) {
    res.send('Hello Specialty');
  });

  router.post('/', async (req, res) => {

    try {
      // Destructuring de lo que manda el usuario
      const {
        name,
        identifier
      } = req.body
  
      const specialty = await Specialty.create({
        name,
        identifier
      });
  
      return res.status(200).json({
        success: true,
        data: specialty
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