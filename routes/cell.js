const express = require('express');
const router = express.Router();
const user = require('../models/users')

router.use(express.static("public"));


router.get("/:cell/", (req, res) => {
  const cell = 'Dunamis'
  user.find({}, {name: 1, position: 1, phone: 1, service: {$slice: -1}})
   .then(response =>{
    console.log(response[0].service[0].meeting);
     res.render("pages/cellPage/", {message: '', users: response});
   })
});

router.post("/:cell/submitattendance", (req, res) => {
  const bodys = req.body;
  console.log(bodys);
 res.send(bodys) 
});
  

module.exports = router