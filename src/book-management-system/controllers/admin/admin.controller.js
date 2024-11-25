const Admin = require('../../models/admin.models');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            console.log("Admin not found:", username);
            return res.status(401).json({ message: "Invalid username or password" });
        }
        console.log("Request body:", req.body);
        console.log("Username:", username);
        console.log("Password:", password);
        // Kiểm tra nếu admin không có mật khẩu
        if (!admin.password) {
            console.log("Admin does not have a password set.");
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // So sánh mật khẩu
        const isPasswordValid = await admin.comparePassword(password);
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Tạo JWT token
        const token = jwt.sign({ id: admin._id }, secretKey, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Error logging in admin", error: error.message });
    }
};
