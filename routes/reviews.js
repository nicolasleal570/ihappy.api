const express = require('express');
const router = express.Router();
const Reviews = require('../models/Reviews');

router.get('/', function (req, res) {
  res.send('Hello Reviews');
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
        id_psicologo,
        id_usuario,
        content,
        created_at,
        rating
    } = req.body

    const reviews = await Reviews.create({
        id_psicologo,
        id_usuario,
        content,
        created_at,
        rating
    });

    return res.status(200).json({
      success: true,
      data: reviews
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