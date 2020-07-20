const express = require('express');
const router = express.Router();
const Reviews = require('../models/Reviews');
const User = require('../models/User');
const queryStrings = require('querystring');
const url = require('url');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

// @desc    Get all reviews
// @route   GET /api/reviews/
// @access  Private
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const reviews = await Reviews.find().lean();

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews/
// @access  Private
router.post('/', isLoggedIn, async (req, res) => {
  try {
    // Destructuring de lo que manda el usuario
    const { slug_psicologo, content } = req.body;

    const psicologo = await User.findOne({ slug: slug_psicologo });

    const review = await Reviews.create({
      psicologo: psicologo._id,
      user: req.user,
      content,
    });

    const allReview = await Reviews.findOne(review).populate('user');

    return res.status(200).json({
      success: true,
      data: allReview,
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
        error: 'Server Error',
      });
    }
  }
});

// @desc    Filter reviews by psychologist
// @route   POST /api/reviews/psychologist/
// @access  Private
router.get('/:psychologist', isLoggedIn, async (req, res) => {
  try {
    // Psychologist slug
    const psychologist = req.params.psychologist;
    const psicologo = await User.findOne({ slug: psychologist });

    if (!psychologist) {
      return res
        .status(400)
        .json({ success: false, error: 'Psychologist ID is required' });
    }
    if (!psicologo) {
      return res
        .status(404)
        .json({ success: false, error: "Psychologist doesn'n exists" });
    }

    const reviews = await Reviews.find({
      psicologo: psicologo._id,
    }).populate('user', ['-__v', '-password']);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        psychologist: psicologo,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

module.exports = router;
