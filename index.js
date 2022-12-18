const express = require("express");
const mongoose = require('mongoose')
const Pcf = require('./models/pcf')
const bodyParser = require('body-parser')
var cors = require('cors');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
var cookieParser = require('cookie-parser');
const cellAdmin = require('./models/celladmin');
const cellAuth = require('./middleware/cellAuth')
 

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors())

// Routes
const userRoute = require('./routes/userRoute')
const cellRoute = require('./routes/cell');
const pcfRoute = require('./routes/pcfRoute')

// Models..........................
const user = require('./models/users');
const { response } = require("express");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())

//  mongoose.connect(`mongodb+srv://honymissy:honymissy1@cluster0.q6yjv.mongodb.net/Service_Attendance?retryWrites=true`)
//  .then(response =>{
//   console.log('Connect');
//  })

app.use(express.static('public'));
app.set("view engine", "ejs");


// ...............Routessss.......................
app.use('/users', userRoute)
app.use('/cell', cellRoute)
app.use('/pcf', pcfRoute)
// routers

app.get('/', cellAuth, (req, res) =>{
  res.redirect('/cell/dashboard')
})

app.get("/pccflogin", (req, res) => {
  res.render('login', {err: ''});
});



app.post("/login", async (req, res) => {
  const pcf = await Pcf.findOne({email: req.body.email})
  if(pcf){
    if(pcf.password == req.body.password){
      const token = jwt.sign(
        { pcf_id: pcf._id, name: pcf.name },
         'oursecretissafe',
        {
          expiresIn: "2h",
        }
      );
      
          res.cookie('user', token)
          res.status(200).redirect('/pcf')
         
        }else{
        res.render('login', {err: 'Username/Password Not Valid'})
        }
      }else{
        res.render('login', {err: 'Username/Password Not Valid'})
      }

});

app.get("/attendancelist", (req, res) => {
   const getDate = req.query.date.toString();
   const cell = req.query.cell;
   
   if(cell){
    user.find({cell: cell, service: {$elemMatch: { date: getDate}}},
      {name: 1, cell: 1, position: 1, "service.$" : 1}).sort({cell: 1})
    .then(response =>{
      res.render("pages/pcfPage/attendance", {createMeeting: false, userAttendance: response});
    })
   }else{
      user.find({service: {$elemMatch: { date: getDate}}},
        {name: 1, cell: 1, position: 1, "service.$" : 1}).sort({cell: 1})
      .then(response =>{
        res.render("pages/pcfPage/attendance", {createMeeting: false, userAttendance: response});
      })
  }
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
    res.render("pages/pcfPage/attendance", {userAttendance: response});
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


// Cell Admin Section
app.get("/users", auth, (req, res) => {
  res.render("pages/pcfPage/users");
});

app.get('/register', (req, res) =>{
  res.render('createmember')
})

app.get('/welcome', auth, (req, res) =>{
  res.send(req.user)
})


app.get('/cellAdmin', (req, res) =>{
  res.render('leaderlogin', {err: ''})
})

app.post('/leaderlogins', async (req, res) =>{
  const admin = await cellAdmin.findOne({email: req.body.email});
  console.log(admin);
  if(admin){
    if(admin.password === req.body.password){
      const token = jwt.sign(
        { _id: admin._id, name: admin.name, cell: admin.cell },
         'ouradminsecretissafer',
        {
          expiresIn: "2h",
        }
      );
      
          res.cookie('cellAdmin', token)
          res.status(200).redirect('/cell/dashboard')
        }else{
        console.log('Problwm 1');
        res.render('leaderlogin', {err: 'Username/Password Not Valid'})
        }
      }else{
        console.log('Problwm 2');
        res.render('leaderlogin', {err: 'Username/Password Not Valid'})
      }

})

app.get('/logoutcell', (req, res) =>{
  res.cookie('cellAdmin', '')
  res.redirect('/cellAdmin')
})

app.get('/logoutpccf', (req, res) =>{
  res.cookie('user', '')
  res.redirect('/pccflogin')
})

// server listening
app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});
