// models/admin.models.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
}, { collection: 'admin' });

adminSchema.pre("save", async function (next) {
    if (!this.password) {
        console.log("Password is missing");
        return next(new Error("Password is required"));
    }

    if (!this.isModified("password")) return next();

    try {
        const saltRounds = 10;
        console.log("Original password:", this.password);
        this.password = await bcrypt.hash(this.password, saltRounds);
        console.log("Hashed password:", this.password);
        next();
    } catch (error) {
        next(error);
    }
});


adminSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw new Error("Error comparing password");
    }
};
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
