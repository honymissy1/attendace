const express = require('express');
const router = express.Router();
const user = require('../models/users')

router.use(express.static("public"));
router.get("/", (req, res) => {
  user.find().sort({name: 1})
  .then(response =>{
    console.log(response);
    res.render("pages/pcfPage/users", {users: response});
  })
});


module.exports = router