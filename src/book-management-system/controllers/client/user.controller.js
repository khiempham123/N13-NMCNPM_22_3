const User = require("../../models/user.models");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; 
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const ForgotPassword = require("../../models/forgot-password.models");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
module.exports.register = async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, password, address, phone } = req.body;
        const user = new User({ username, email, password, address, phone });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login request body:", req.body);
        
        const user = await User.findOne({ username:username });
        console.log("Found user:", user);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        if (!(await user.comparePassword(password))) {
            return res.status(402).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};




module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
  
    const user = await User.findOne({
      email: email
    });
  
    if (!user) {
        return res.status(404).json({ message: "Email không tồn tại" });
    }
  
    const otp = generateHelper.generateRandomNumber(8);
  
    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now()
    };
  
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
  
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
      Mã OTP để lấy lại mật khẩu là <b style="color: green;">${otp}</b>. Thời hạn sử dụng là 3 phút.
    `;
    sendMailHelper.sendMail(email, subject, html);
  
    res.status(200).json({ message: "OTP đã được gửi đến email của bạn." });  // Thay vì redirect
};

module.exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log("Request body:", req.body);
    // Tìm kiếm OTP trong cơ sở dữ liệu cho email này
    const forgotPasswordRequest = await ForgotPassword.findOne({ email, otp });

    if (!forgotPasswordRequest) {
        return res.status(400).json({ message: "OTP không hợp lệ" });
    }

    // Kiểm tra thời gian hết hạn của OTP (3 phút)
    const expirationTime = forgotPasswordRequest.expireAt;
    if (Date.now() - expirationTime > 3 * 60 * 1000) {
        // Xóa OTP hết hạn khỏi cơ sở dữ liệu
        await ForgotPassword.deleteOne({ email, otp });
        return res.status(400).json({ message: "Mã OTP đã hết hạn" });
    }

    res.status(200).json({ message: "OTP hợp lệ, bạn có thể thay đổi mật khẩu" });
};
module.exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm người dùng bằng email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Kiểm tra mật khẩu mới có giống với mật khẩu cũ hay không
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "Mật khẩu mới không được trùng với mật khẩu hiện tại." });
        }
        user.password = password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại.", error: error.message });
    }
};