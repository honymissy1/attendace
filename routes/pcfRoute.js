const express = require('express');
const router = express.Router();
const user = require('../models/users')
const auth = require("../middleware/auth");


router.get("/", auth, (req, res) => {
    res.render("pages/pcfPage/");
});
  
 router.get("/attendance", (req, res) => {
    const userAttendance = ''; 
    res.render("pages/pcfPage/attendance", { userAttendance});
  });
  
  router.get("/add", (req, res) => {
    res.render("pages/pcfPage/addmembers");
  });

module.exports = router