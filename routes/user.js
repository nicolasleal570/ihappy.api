const express = require('express');
const router = express.Router();
const User = require('../models/User');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

// @desc    List of profiles
// @route   GET /api/users/
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      data: users
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

// @desc    Look an user profile
// @route   GET /api/users/profile/:slug
// @access  Public
router.get('/profile/:slug', async (req, res) => {

  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        err
      });
    }

    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err
    });
  }

});

// @desc    Modify profile of logged user
// @route   PUT /api/users/profile/:slug
// @access  Private
router.put('/profile/:slug', isLoggedIn, async (req, res) => {
  try {
    const { slug } = req.params;

    // if the slug is null
    if (!slug) {
      return res.status(400).json({
        success: false,
        err
      });
    }

    const user = await User.findOne({ slug });

    // If user doesn't exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    const requestedUserID = req.user._id + '';
    const userID = user._id + ''

    // If the user making the request is different from the profile
    if (requestedUserID !== userID) {
      return res.status(401).json({
        success: false,
        error: 'You doesn\'n have permissions to do this'
      });
    }

    const newUser = await User.findOneAndUpdate({ slug }, { ...req.body }, { returnOriginal: false, useFindAndModify: false });

    return res.status(200).json({
      success: true,
      data: newUser
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err
    });
  }
})


module.exports = router;