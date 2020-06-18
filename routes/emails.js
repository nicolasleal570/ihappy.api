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
    host: 'smtp.gmail.com',
    secureConnection: false,
    port: 587,
    requiresAuth: true,
    domains: ["gmail.com", "googlemail.com"], // e.g. smtp.gmail.com
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
      console.log('Transporter is working!');
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
      html:`<h2>${name}, gracias por contacatar a iHappy</h2><p>Nuestro equipo de soporte lo atenderá lo mas rapido posible</p>
      <hr></hr> 
      <img src="https://res.cloudinary.com/delbvxq6t/image/upload/v1592084209/logo_mmwg0k.png" width="80" height="80"></img>
      <p>Gracias por elegirnos!</p>`
    }
    var reply = {
      from: name,
      to: 'TheRealiHappy@gmail.com',  
      subject: `Support Request - iHappy`,
      html:`Enviaron un correo desde su pagina web
      <p>Nombre:${name}</p> 
      <p>Correo:${email}</p>
      <p>Mensaje:${message}</p>`
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
    transporter.sendMail(reply, (err, data) => {
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