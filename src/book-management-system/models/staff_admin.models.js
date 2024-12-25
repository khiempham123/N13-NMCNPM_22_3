// models/staff.js
const mongoose = require('mongoose');

const staffadminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String },
    birthDay: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    role: { type: String, enum: ['staff', 'admin'], required: true },
    avatar: { type: String },
    refreshToken: { type: String, default: null }, 
},{ timestamps: true });

module.exports = mongoose.model('Staff_Admin', staffadminSchema);