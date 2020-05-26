const express = require('express');
const router = express.Router();
const Factura = require('../models/Factura');

router.get('/', function (req, res) {
  res.send('Hello Factura');
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
        id_psicologo,
        id_usuario,
        fecha,
        total,
        id_tarjeta
    } = req.body

    const factura = await Factura.create({
        id_psicologo,
        id_usuario,
        fecha,
        total,
        id_tarjeta
    });

    return res.status(200).json({
      success: true,
      data: factura
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
module.exports = router;