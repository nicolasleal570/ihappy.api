const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', function (req, res) {
  res.send('Hello Americania');
});

router.get('/specific', function (req, res) {
  res.send('Hello Arawato');
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
      name,
      last_name,
      cedula,
      adress,
      public_name,
      identification,
      bio
    } = req.body

    const user = await User.create({
      name,
      last_name,
      cedula,
      adress,
      public_name,
      identification,
      bio
    });

    return res.status(200).json({
      success: true,
      data: user
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