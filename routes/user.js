const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const Speciality = require('../models/Specialty');
const cloudinary = require('cloudinary');
const filesystem = require('fs-extra');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// @desc    List of profiles
// @route   GET /api/users/
// @access  Public
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const users = await User.find()
      .populate('role')
      .populate('speciality')
      .lean();

    return res.status(200).json({
      success: true,
      data: users,
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
        error: 'Server Error ' + err,
      });
    }
  }
});

// Get doctors by speciality
router.get('/specialities/', isLoggedIn, async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'The name was not provide',
      });
    }

    const speciality = await Speciality.findOne({
      name,
    });

    const role = await Role.findOne({ identification: 'psicologo' });

    if (!speciality) {
      return res.status(400).json({
        success: false,
        error: "That speciality does't exists",
      });
    }

    const users = await User.find({ speciality, role })
      .lean()
      .populate('role')
      .populate('speciality');

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error' + err,
    });
  }
});

// Get pacients
router.get('/pacients', isLoggedIn, async (req, res) => {
  try {
    const { limit } = req.query;

    const role = await Role.findOne({ identification: 'usuario' });
  
    if (!role) {
      res.status(400).json({
        success: false,
        data: "Role doesn't exists",
      });
    }

    let doctors = [];
    if (limit) {
      doctors = await User.find({ role })
        .lean()
        .limit(Number(limit))
        .populate('role')
        .populate('speciality');
    } else {
      doctors = await User.find({ role })
        .lean()
        .populate('role')
        .populate('speciality');
    }

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

// Get doctors normal user
router.get('/doctors', isLoggedIn, async (req, res) => {
  try {
    const { limit } = req.query;

    const role = await Role.findOne({ identification: 'psicologo'});
  
    if (!role) {
      res.status(400).json({
        success: false,
        data: 'Role doesn\'t exists'
      });
    }

    let doctors = [];
    if (limit) {
      doctors = await User.find({ role , disabled:  false}).limit(Number(limit)).populate('role').populate('speciality');
    } else {
      doctors = await User.find({ role , disabled : false}).populate('role').populate('speciality');
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

// Get doctors admin user
router.get('/doctors/admin', isLoggedIn, async (req, res) => {
  try {
    const { limit } = req.query;

    const role = await Role.findOne({ identification: 'psicologo'});
  
    if (!role) {
      res.status(400).json({
        success: false,
        data: "Role doesn't exists",
      });
    }

    let doctors = [];
    if (limit) {
      doctors = await User.find({ role })
        .lean()
        .limit(Number(limit))
        .populate('role')
        .populate('speciality');
    } else {
      doctors = await User.find({ role })
        .lean()
        .populate('role')
        .populate('speciality');
    }

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

// Get doctors home --Only 4 whitout the need of been login--
router.get('/home/doctors', async (req, res) => {
  try {
    const role = await Role.findOne({ identification: 'psicologo' }).lean();

    if (!role) {
      res.status(400).json({
        success: false,
        data: "Role doesn't exists",
      });
    }

    let doctors = [];
    doctors = await User.find({ role }).limit(Number(4));

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

// Get count of doctors by specialityes
router.get('/specialities/count', isLoggedIn, async (req, res) => {
  try {
    const aggregatorOpts = [
      {
        $unwind: '$speciality',
      },
      {
        $lookup: {
          from: 'specialities', // other table name
          localField: 'speciality', // name of users table field
          foreignField: '_id', // name of userinfo table field
          as: 'na', // alias for userinfo table
        },
      },

      {
        $group: {
          _id: '$na.name',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const users = await User.aggregate(aggregatorOpts).exec();

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error' + err,
    });
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
        error: 'The slug was not provide',
      });
    }

    const user = await User.findOne({ slug }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
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
      precioConsulta,
      speciality,
    } = req.body;

    const newUser = await User.findOneAndUpdate(
      { _id: requestedUserID },
      {
        first_name,
        last_name,
        cedula,
        address,
        bio,
        precioConsulta,
        speciality,
      },
      { returnOriginal: false, useFindAndModify: false }
    );


    const usuarioActualizado = await User.findById(newUser._id)
    .populate('speciality').populate('role')


    return res.status(200).json({
      success: true,
      data: usuarioActualizado
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

// @desc Disable an user
// @route PUT /api/users/disable
// @access Private
router.put('/disable/:slug', isLoggedIn, async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'The slug was not provide',
      });
    }

    const user = await User.findOne({ slug });

    let habilitado = false;
    if (user.disabled == null) {
      habilitado = true;
    }
    if (user.disabled == true) {
      habilitado = false;
    }
    if (user.disabled == false) {
      habilitado = true;
    }
    const disabled = await habilitado;

    const newUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        disabled,
      },
      { returnOriginal: false, useFindAndModify: false }
    );

    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

// router.put('/disableRole/:slug', isLoggedIn, async (req, res) => {
//   try {

//     const {slug}  = req.params;

//     if (!slug) {
//       return res.status(400).json({
//         success: false,
//         error: 'The slug was not provide'
//       });
//     }

//     const user = await User.findOne({ slug });

//     let roleIdentification = 'psicologo';
//     if(user.role.identification=='psicologo'){
//       roleIdentification = 'psicologoDeshabilitado';
//     }
//     if(user.role.identification=='psicologoDeshabilitado'){
//       roleIdentification = 'psicologo'
//     }

//     const role.identification = await roleIdentification

//     const newUser = await User.findOneAndUpdate({ _id: user._id }, {
//         role.identification  
//     }, { returnOriginal: false, useFindAndModify: false });

//     return res.status(200).json({
//       success: true,
//       data: newUser
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error ' + err
//     });
//   }
// });

// @desc    Update user image profile
// @route   PUT /api/users/avatar
// @access  Private
router.put('/avatar', isLoggedIn, async (req, res) => {
  try {
    const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path);

    const user = await User.findByIdAndUpdate(
      req.user,
      { avatar: secure_url },
      { new: true, useFindAndModify: false }
    );
    await filesystem.unlink(req.file.path);

    return res.status(200).json({
      success: false,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
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

    const { speciality } = req.body;

    user.speciality.forEach((element) => {
      const oldSpeciality = element + ''; // Porque tiene que ser un string
      if (oldSpeciality === speciality) {
        return res.status(400).json({
          success: false,
          error: 'That speciality already exists',
        });
      }
    });

    const newUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { speciality: speciality } },
      { new: true, useFindAndModify: false }
    );

    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
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

    const newUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { speciality: specialityVal } },
      { new: true, useFindAndModify: false }
    );

    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

module.exports = router;
