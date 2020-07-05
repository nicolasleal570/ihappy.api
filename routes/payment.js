const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51H1MAEHa17GfKEWJaN3ZP9sOi4aatrWtGnOezhhKSa3VoON5OWHorlabuDbIokGqWNwUssFxDxvD5e18BOUMWwPG00q8bY3Qpe');
const Payment = require('../models/Payment');
const isLoggedIn = require('../utils/verifyProtectedRoutes');

router.get('/', function (req, res) {
    res.send('Hello payments');
  });

router.post('/', isLoggedIn, async(req,res) => {
    const {id,amount} = req.body;

    try{
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'USD',
            payment_method:id,
            confirm:true
        });
        console.log(payment)
        return res.status(200).json({
            confirm:'Compra realizada.'
        })
    }catch(error){
        return res.status(400).json({
            error:error.message
        })
        console.log(error.message)
    }
})

module.exports = router;