const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const Staff = require('../../../models/staff'); // Đảm bảo đường dẫn chính xác tới model Staff

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/book_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));

// Đọc dữ liệu từ file JSON
const data = JSON.parse(fs.readFileSync('staff.json', 'utf8'));

async function importData() {
    for (let i = 0; i < data.length; i++) {
        const { username, password } = data[i];
        
        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo tài khoản mới
        const newStaff = new Staff({
            username,
            password: hashedPassword
        });

        // Lưu vào MongoDB
        await newStaff.save();
        console.log(`Tạo tài khoản ${username} thành công`);
    }
    mongoose.disconnect();
}

importData();