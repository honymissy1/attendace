const express = require('express');
const router = express.Router();

router.use(express.static("public"));
router.get("/", (req, res) => {
  res.render("pages/pcfPage/users", {users: 'List Of all users from db that we got'});
});

router.get("/:cell", (req, res) => {
  res.render("pages/cellPage/index", {users: 'For cell members'});
});


module.exports = router