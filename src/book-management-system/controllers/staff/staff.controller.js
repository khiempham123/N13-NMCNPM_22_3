const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../../models/staff');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra xem username có tồn tại không
        const staff = await Staff.findOne({ username });
        if (!staff) {
            return res.status(400).json({ message: 'Username không tồn tại' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: staff._id, username: staff.username },
            process.env.JWT_SECRET, // secret key từ environment variables
            { expiresIn: '1h' } // Thời gian hết hạn của token
        );

        res.json({ token }); // Trả về token cho client
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
    }
};

module.exports = {
    login
};