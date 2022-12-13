const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    dob: String,
    phone: Number,
    email: String,
    cell: String,
    position: String,
    address: String,
    service: [{
        meeting: String,
        date: String,
        present: Boolean,
        details: String,
        comment: String
    }]
})

const Users = mongoose.model('user', userSchema);

module.exports = Users