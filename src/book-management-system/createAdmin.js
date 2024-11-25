const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin.models'); // Đảm bảo đường dẫn đúng đến model của bạn

const createAdmin = async () => {
    try {
        // Kết nối đến cơ sở dữ liệu
        await mongoose.connect('mongodb://localhost:27017/book_management', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully.');

        // Băm mật khẩu và tạo admin
        const hashedPassword = await bcrypt.hash('datkochin', 10); // Thay 'password' bằng mật khẩu mong muốn
        const admin = new Admin({
            username: 'admin2', // Thay đổi thông tin admin tùy ý
            password: hashedPassword,
            email: 'admin2@example.com' // Đảm bảo email là duy nhất
        });
        await admin.save();
        console.log('Admin created successfully:', admin);

        // Đóng kết nối MongoDB sau khi hoàn thành
        mongoose.disconnect();
    } catch (error) {
        console.error('Error creating admin:', error);
    }
};

createAdmin(); // Gọi hàm
