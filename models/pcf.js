const mongoose = require('mongoose');

const pcfSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: Number,
    token: { type: String },
})

const Pcf = mongoose.model('pcf', pcfSchema);

module.exports = Pcf