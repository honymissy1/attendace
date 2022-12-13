const mongoose = require('mongoose');

const celladmin = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: Number,
    cell: String,
    access:[String]
})

const cellAdmin = mongoose.model('cellAdmin', celladmin);

module.exports = cellAdmin