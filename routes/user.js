const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    // const {
    //   email,
    //   username,
    //   password1,
    //   password2
    // } = req.body

    // const user = await User.create({
    //   email,
    //   username,
    //   password
    // });

    // return res.status(200).json({
    //   success: true,
    //   data: user
    // });

    res.send('Hello World');

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