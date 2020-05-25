const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', function (req, res) {
    res.send('Hello Americania');
  });

router.get('/specific', function (req, res) {
    res.send('Hello Arawato');
  });

router.post('/', (req, res) => {
  const user = new User({
    name: req.body.name,
    last_name: req.body.last_name,
    cedula: req.body.cedula,
    adress: req.body.adress,
    public_name: req.body.public_name,
    identification: req.body.identification,
    bio: req.body.bio
      
  });
  user.save().then(data=>{
    res.json(data);
  }).catch(err=>{
    res.json({ message: err});
  });
});
module.exports = router;