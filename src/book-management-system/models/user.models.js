const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, required: true, unique: true }, // Added phone field
    token: { type: String },// Added token field
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { collection: 'user' });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        console.log("Password before hashing:", this.password);
        const saltRounds = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (password) {
    console.log("Hashed password from DB:", this.password);
    console.log("Plain password to compare:", password);
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema,"user");

module.exports = User;














