const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const cloudinary = require('cloudinary');
const filesystem = require('fs-extra');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// @desc    List of profiles
// @route   GET /api/users/
// @access  Public
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const users = await User.find().populate('role').populate('speciality');

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

router.get('/doctors', isLoggedIn, async (req, res) => {
  try {
    const { limit } = req.query;

    const role = await Role.findOne({ identification: 'psicologo' });

    if (!role) {
      res.status(400).json({
        success: false,
        data: 'Role doesn\'t exists'
      });
    }

    let doctors = [];
    if (limit) {
      doctors = await User.find({ role }).limit(Number(limit));
    } else {
      doctors = await User.find({ role });
    }


    res.status(200).json({
      success: true,
      data: doctors
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err
    });
  }
})

// @desc    Look an user profile
// @route   GET /api/users/profile/:slug
// @access  Public
router.get('/profile/:slug', async (req, res) => {

  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'The slug was not provide'
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
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', isLoggedIn, async (req, res) => {
  try {

    const requestedUserID = req.user;

    const {
      first_name,
      last_name,
      cedula,
      address,
      bio,
    } = req.body

    const newUser = await User.findOneAndUpdate({ _id: requestedUserID }, {
      first_name,
      last_name,
      cedula,
      address,
      bio
    }, { returnOriginal: false, useFindAndModify: false });

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
});

// @desc    Update user image profile
// @route   PUT /api/users/avatar
// @access  Private
router.put('/avatar', isLoggedIn, async (req, res) => {
  try {

    const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

    const user = await User.findByIdAndUpdate(req.user, { avatar: secure_url }, { new: true, useFindAndModify: false });
    await filesystem.unlink(req.file.path);

    return res.status(200).json({
      success: false,
      data: user
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err
    });
  }
});

// @desc    Add new Speciality to a logged user
// @route   POST /api/users/add-new-speciality
// @access  Private
router.post('/add-speciality', isLoggedIn, async (req, res) => {

  try {
    const requestedUserID = req.user;

    const user = await User.findOne({ _id: requestedUserID });

    const { speciality } = req.body

    user.speciality.forEach(element => {
      const oldSpeciality = element + ''; // Porque tiene que ser un string
      if (oldSpeciality === speciality) {
        return res.status(400).json({
          success: false,
          error: 'That speciality already exists'
        });
      }
    });

    const newUser = await User.findByIdAndUpdate(user._id,
      { $push: { speciality: speciality } },
      { new: true, useFindAndModify: false }
    );

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
});

// @desc    Remove one Speciality to a logged user
// @route   POST /api/users/remove-new-speciality
// @access  Private
router.post('/remove-speciality', isLoggedIn, async (req, res) => {

  try {
    const requestedUserID = req.user;

    const user = await User.findOne({ _id: requestedUserID });

    const specialityVal = req.body.speciality;

    const newUser = await User.findByIdAndUpdate(user._id,
      { $pull: { speciality: specialityVal } },
      { new: true, useFindAndModify: false }
    );

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
});


module.exports = router;