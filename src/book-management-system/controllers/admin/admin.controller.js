const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../../models/user.models');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const staff = await Staff.findOne({ username });
        if (!staff) {
            return res.status(400).json({ message: 'Username không tồn tại' });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác' });
        }

        const token = jwt.sign(
            { id: staff._id, username: staff.username },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.json({ token }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
    }
};

module.exports = {
    login
};