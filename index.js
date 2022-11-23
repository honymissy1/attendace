const express = require("express");
const mongoose = require('mongoose')
const app = express();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;
var cors = require('cors')

 
app.use(cors())

// Routes
const userRoute = require('./routes/userRoute')
const cellRoute = require('./routes/cell')

// Models..........................
const user = require('./models/users')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

 mongoose.connect(`mongodb+srv://honymissy:honymissy1@cluster0.q6yjv.mongodb.net/Service_Attendance?retryWrites=true`)
 .then(response =>{
  console.log('Connect');
 })


app.use(express.static("public"));
app.set("view engine", "ejs");



// ...............Routessss.......................
app.use('/users', userRoute)
app.use('/cell', cellRoute)

// routers
app.get("/", (req, res) => {
  res.send("login");
});



app.get("/pcf", (req, res) => {
  res.render("pages/pcfPage/");
});

app.get("/attendance", (req, res) => {
  const userAttendance = ''; 
  res.render("pages/pcfPage/attendance", { userAttendance});
});



app.get("/attendancelist", (req, res) => {
 
  let userAttendance = []
   const getDate = req.query.date.toString();
  user.find({ service: {$elemMatch: { date: getDate}}},
    {name: 1, cell: 1, position: 1, "service.$" : 1}) 
  .then(response =>{
    userAttendance = response;
    console.log(userAttendance);
    res.render("pages/pcfPage/attendance", {createMeeting: false, userAttendance});
  })
});

app.post("/cellDatabase", (req, res) => { 
  user.updateMany({}, {$push: {"service":
                                      { 
                                        meeting: req.body.service,
                                        date: req.body.date,
                                        details: req.body.details, 
                                        present: false, 
                                        comment: ''       
                                   }} })
  .then(response =>{
    res.render("pages/pcfPage/attendance", {createMeeting: true, userAttendance});
  })
});

app.get('/meetings', (req, res) =>{
  user.find({service: {$elemMatch: { date: "2022-11-25"}}}, {name: 1, cell: 1, position: 1, "service.$" : 1}) 
   .then(response =>{
      res.send(response)
   })
})



// Pcf dashboard ends here
// ...............................................

app.get("/users", (req, res) => {
  res.render("pages/pcfPage/users");
});

// server listening
app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});
