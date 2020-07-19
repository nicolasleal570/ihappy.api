const express = require('express');
const router = express.Router();
const Specialty = require('../models/Specialty');

// @desc    View all Specialities
// @route   GET /api/specialities/
// @access  Public
router.get('/', async (req, res) => {
  try {
    const specialities = await Specialty.find().lean();
    return res.status(200).json({
      success: true,
      data: specialities,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @desc    Create new Speciality
// @route   GET /api/users/
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Destructuring de lo que manda el usuario
    const { name, slug } = req.body;

    const specialty = await Specialty.create({
      name,
      slug,
    });

    return res.status(200).json({
      success: true,
      data: specialty,
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
module.exports = router;
