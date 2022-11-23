const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    age: Number,
    dob: String,
    phone: Number,
    cell: String,
    position: String,
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