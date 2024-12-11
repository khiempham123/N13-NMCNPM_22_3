// models/staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthDay: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    livingIn: { type: String, required: true },
    from: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    workingTime: { type: String, required: true },
    dayOff: { type: String, required: true },
    levelOfExperience: { type: String, required: true },
    timekeeping: { type: String, required: true },
});

module.exports = mongoose.model('Staff', staffSchema);