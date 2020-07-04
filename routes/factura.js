const express = require('express');
const router = express.Router();
const Factura = require('../models/Factura');
const User = require('../models/User');
const queryStrings = require('querystring');
const url = require('url');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const factura = await Factura.find();

    return res.status(200).json({
      success: true,
      data: factura
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err
    });
  }
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
        slug_psicologo,
        id_usuario,
        fecha,
        total,
        id_tarjeta
    } = req.body

    const psicologo = await User.findOne({ slug: slug_psicologo });

    const factura = await Factura.create({
        id_psicologo: psicologo._id,
        id_usuario,
        fecha,
        total,
        id_tarjeta
    });

    const Allfactura = await Factura.findOne(factura).populate('user');

    return res.status(200).json({
      success: true,
      data: Allfactura
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
router.get('/:psychologist', isLoggedIn, async (req, res) => {
  try {

    // Psychologist slug
    const psychologist = req.params.psychologist;
    const psicologo = await User.findOne({ slug: psychologist });

    if (!psychologist) {
      return res.status(400).json({ success: false, error: 'Psychologist ID is required' })
    }
    if (!psicologo) {
      return res.status(404).json({ success: false, error: 'Psychologist doesn\'n exists' })
    }

    const factura = await Factura.find({ psicologo: psicologo._id }).populate('user', ['-__v', '-password']);

    res.status(200).json({
      success: true,
      data: {
        factura,
        psychologist: psicologo
      }
    });


  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
})


module.exports = router;