const bcrypt = require("bcrypt");
const User = require("../../models/user"); 

// Hàm đăng ký người dùng
const registerUser   = async (req, res) => {
    const { username, password, email } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser   = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ message: "Email đã được sử dụng." });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser   = new User({ username, password: hashedPassword, email });
        await newUser .save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
};

// Hàm đăng nhập người dùng
const loginUser  = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu." });
    }

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại." });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không chính xác." });
        }

        // Nếu đăng nhập thành công, trả về thông tin người dùng (trừ mật khẩu)
        res.status(200).json({ 
            message: "Đăng nhập thành công!", 
            user: { id: user._id, username: user.username, email: user.email } 
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
};

// Hàm thay đổi mật khẩu
const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    try {
        // Tìm người dùng theo ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; // Cập nhật mật khẩu mới

        await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

        res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
};

module.exports = {
    registerUser ,
    loginUser ,
    changePassword,
};