const express = require('express');
const router = express.Router();
const user = require('../models/users')

router.use(express.static("public"));

router.get("/dashboard", (req, res) => {
  const cell = "Dunamis";
  user.find({cell: cell, "service.present": false}, {name: 1, position: 1, email: 1, phone: 1, service: {$slice: -1}})
   .then(response =>{
     res.render("pages/cellPage/", {message: '', users: response, cell: 'Dunamis'});
   })
});

router.get("/addmembers", (req, res) => {
  res.render('pages/cellPage/addmembers', {cell: 'Dunamis', message: ''})
});


router.get("/members", (req, res) => {
  const cell = req.query.cell;
  user.find({cell: cell}, {name: 1, position: 1,email: 1, phone: 1, service: {$slice: -1}})
  .then(response =>{
    res.render('pages/cellPage/members', { users: response, cell: 'Dunamis'})
  })
});

router.post("/addmembers", (req, res) => {  
  user.create({
    name: req.body.name,
    phone: req.body.number,
    email: req.body.email,
    cell: req.body.cell,
    position: req.body.role,
  }).then(response =>{
    console.log(response);
    res.render('pages/cellPage/addmembers', {cell: 'Dunamis',message: 'Added Successfully'})
  })
});

router.post("/submitattendance", (req, res) => {
  const bodys = req.body;

  user.updateMany({_id: bodys.present},
   {$set: {"service.$[].present": true}}, 
   {multi: true})
  .then(response => {
    console.log(response);
    res.render("pages/cellPage/submitsuccess");
  })
});

module.exports = router