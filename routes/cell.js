const express = require('express');
const router = express.Router();
const user = require('../models/users');
const cellAuth = require('../middleware/cellAuth')

router.use(express.static("public"));

router.get("/dashboard", cellAuth, (req, res) => {
  console.log(req.user);
  const cell = req.user.cell;
  user.find({cell: cell, "service.present": false}, {name: 1, position: 1, email: 1, phone: 1, service: {$slice: -1}})
   .then(response =>{
     res.render("pages/cellPage/", {message: '', users: response, cell: 'Dunamis'});
   })
});

router.get("/addmembers", cellAuth, (req, res) => {
  res.render('pages/cellPage/addmembers', {cell: req.user.cell, message: ''})
});


router.get("/members", cellAuth, (req, res) => {
  const cell = req.user.cell;
  user.find({cell: cell}, {name: 1, position: 1,email: 1, phone: 1, service: {$slice: -1}})
  .then(response =>{
    res.render('pages/cellPage/members', { users: response, cell})
  })
});

router.post("/addmembers", cellAuth, (req, res) => {  
  user.create({
    name: req.body.name,
    phone: req.body.number,
    email: req.body.email,
    address: req.body.address,
    cell: req.body.cell,
    position: req.body.role,
  }).then(response =>{
    console.log(response);
    res.render('pages/cellPage/addmembers', {cell: req.user.cell,message: 'Added Successfully'})
  })
});

router.post("/submitattendance/:id", (req, res) => {
  console.log('ent here');
  console.log(req.body);
  user.updateOne({_id: req.params.id},
   {$set: {"service.$[].present": req.body.toggle, "service.$[].comment": req.body.reason}}, 
   {multi: true})
  .then(response => {
    console.log(response);
    res.redirect('/cell/dashboard')
  })
  
  
});






module.exports = router