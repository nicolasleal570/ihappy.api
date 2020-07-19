const express = require('express');
const router = express.Router();
const Factura = require('../models/Factura');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const queryStrings = require('querystring');
const url = require('url');

const isLoggedIn = require('../utils/verifyProtectedRoutes');

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const factura = await Factura.find();

    return res.status(200).json({
      success: true,
      data: factura,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

//Metodo post para Stripe
router.post('/', isLoggedIn, async (req, res) => {
  const { id, amount, slug_psicologo } = req.body;
  // const user = await User.findById(req.user);
  const psicologo = await User.findOne({ slug: slug_psicologo });

  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'USD',
      payment_method: id,
      description: `Pago a psicologo: ${psicologo._id}, un total de ${
        amount / 100
      }`,
      confirm: true,
    });
    const factura = await Factura.create({
      payment_id: payment.id,
      total: amount / 100,
      psicologo: psicologo._id,
      user: req.user,
    });
    const Allfactura = await Factura.findOne(factura).populate('user');
    return res.status(200).json({
      confirm: 'Compra realizada.',
      confirm: 'Factura creada',
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    // Destructuring de lo que manda el usuario
    const { slug_psicologo, id_usuario, fecha, total, id_tarjeta } = req.body;

    const psicologo = await User.findOne({ slug: slug_psicologo });

    const factura = await Factura.create({
      id_psicologo: psicologo._id,
      id_usuario,
      fecha,
      total,
      id_tarjeta,
    });

    const Allfactura = await Factura.findOne(factura).populate('user');

    return res.status(200).json({
      success: true,
      data: Allfactura,
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
// router.put("/:psychologist", isLoggedIn, async(req,res) => {
//   try{
//     const psychologist = req.params.psychologist;
//     const psicologo = await User.findOne({slug: psychologist})

//   }
// })
router.put('/:psychologist', isLoggedIn, async (req, res) => {
  try {
    const { requestToPay, psicoID } = req.body;

    const newBill = await Factura.updateMany(
      { psicologo: psicoID },
      {
        requestToPay,
      },
      { returnOriginal: false, useFindAndModify: false }
    );

    return res.status(200).json({
      success: true,
      data: newBill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

router.put('/:psychologist/paid', isLoggedIn, async (req, res) => {
  try {
    const { paid, psicoID } = req.body;

    const newBill = await Factura.updateMany(
      { psicologo: psicoID },
      {
        paid,
      },
      { returnOriginal: false, useFindAndModify: false }
    );

    return res.status(200).json({
      success: true,
      data: newBill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
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

    const factura = await Factura.find({ psicologo: psicologo._id }).populate(
      'user'
    );

    res.status(200).json({
      success: true,
      data: {
        factura,
        psicologo,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Get id and total of Ganancias
router.get('/stats/finance', isLoggedIn, async (req, res) => {
  try {
    const factura = await Factura.find().populate('user').populate('psicologo');

    return res.status(200).json({
      success: true,
      data: factura,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error ' + err,
    });
  }
});

module.exports = router;
