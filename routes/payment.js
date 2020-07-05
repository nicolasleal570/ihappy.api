// const express = require('express');
// const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_KEY);

// const isLoggedIn = require('../utils/verifyProtectedRoutes');

// router.get('/', isLoggedIn, function (req, res) {
 


// });

// router.post('/', isLoggedIn, async(req,res) => {
//     const {id,amount} = req.body;

//     try{
//         const payment = await stripe.paymentIntents.create({
//             amount: amount,
//             currency: 'USD',
//             payment_method:id,
//             confirm:true
//         });
//         console.log(payment)
//         return res.status(200).json({
//             confirm:'Compra realizada.'
//         })
//     }catch(error){
//         return res.status(400).json({
//             error:error.message
//         })
//         console.log(error.message)
//     }
// })

// module.exports = router;