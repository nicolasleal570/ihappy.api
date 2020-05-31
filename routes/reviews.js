const express = require('express');
const router = express.Router();
const Reviews = require('../models/Reviews');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

// @desc    Get all reviews
// @route   GET /api/reviews/
// @access  Private
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const reviews = await Reviews.find();

    return res.status(200).json({
      success: true,
      data: reviews
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews/
// @access  Private
router.post('/', isLoggedIn, async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
      id_psicologo,
      content,
    } = req.body

    const review = await Reviews.create({
      psicologo: id_psicologo,
      user: req.user,
      content,
    });

    return res.status(200).json({
      success: true,
      data: review
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

// @desc    Filter reviews by psychologist
// @route   POST /api/reviews/psychologist/
// @access  Private
router.post('/psychologist', isLoggedIn, async (req, res) => {
  try {

    const { id_psicologo } = req.body;

    if (!id_psicologo) {
      return res.status(400).json({ success: false, error: 'Psychologist ID is required' })
    }

    const reviews = await Reviews.find({ psicologo: id_psicologo }).populate('user',['-__v', '-password']);

    res.status(200).json({
      success: true,
      data: reviews
    });


  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
})

module.exports = router;