const express = require('express');
const router = express.Router();
const Bank_accounts = require('../models/Bank_accounts');

router.get('/', function (req, res) {
  res.send('Hello Conversations');
});

router.post('/', async (req, res) => {

  try {
    // Destructuring de lo que manda el usuario
    const {
        id_user,
        bank,
        card_number,
        card_CVV
    } = req.body

    const bank_accounts = await Bank_accounts.create({
        id_user,
        bank,
        card_number,
        card_CVV
    });

    return res.status(200).json({
      success: true,
      data: bank_accounts
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