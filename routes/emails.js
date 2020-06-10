const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const creds = require('../config')
const nodemailer = require('nodemailer')
// @desc    Get all role
// @route   GET /api/roles/
// @access  Public
router.get('/', async (req, res) => {
    try {

        const emails = await Email.find();

        return res.status(200).json({
            success: true,
            data: emails
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }

});

// @desc    Create new role
// @route   POST /api/roles/
// @access  Public

//enviar correos

var transport = {
    host: 'smtp.gmail.com', // e.g. smtp.gmail.com
    auth: {
      user: creds.USER,
      pass: creds.PASS
    }
  }
  
  var transporter = nodemailer.createTransport(transport)
  
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('All works fine, congratz!');
    }
  });

router.post('/', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const message = req.body.message
    console.log(message)
    var mail = {
      from: name,
      to: email,  
      subject: `iHappy`,
      html:`${name}, hemos recibido su solicitud, le responderemos en la mayor brevedad posible`
    }

    
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          msg: 'fail'
        })
      } else {
        res.json({
          msg: 'success'
        })
      }
    })
  })
module.exports = router;