const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const verifyUser = require('../utils/verifyRoutes');

// @desc    Register new user
// @route   POST /api/users/register/
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // Destructuring de lo que manda el usuario
    const {
      email,
      username,
      password,
      role
    } = req.body

    // Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({ success: false, data: "Email already exists" })
    }

    const user = await User.create({
      email,
      username,
      password: hashPassword,
      role
    });
    
    // Create JWT a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    // Send a new token to the client (frontend)
    res.header('auth-token', token).json({
      success: true, 
      token
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
        error: 'Server Error ' + err
      });
    }
  }

});

// @desc    Register new user
// @route   POST /api/users/login/
// @access  Public
router.post('/login', async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body

    // Validate if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success: false, data: "User doesn't exists" })
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, error: "Invalid password" });
    }

    // Create JWT a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    // Send a new token to the client (frontend)
    res.header('auth-token', token).json({
      success: true,
      token
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
        error: 'Server Error ' + err
      });
    }
  }
});

// @desc    Look at the profile of the logged in user
// @route   GET /api/users/profile/
// @access  Private
router.get('/profile', verifyUser, async (req, res) => {
  try {

    const { _id } = req.user
    const user = await User.findById(_id);

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {

  }
});

module.exports = router;