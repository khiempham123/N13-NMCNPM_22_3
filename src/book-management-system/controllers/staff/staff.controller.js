const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Staff = require("../../models/staff_admin.models");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Kiểm tra xem username có tồn tại không
    const staff = await Staff.findOne({ username });
    if (!staff) {
      return res.status(400).json({ message: "Username không tồn tại" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }

    // Tạo Access Token
    const accessToken = jwt.sign(
      { id: staff._id, username: staff.username, role: staff.role },
      process.env.JWT_SECRET, // secret key từ environment variables
      { expiresIn: "1h" } // Thời gian hết hạn của Access Token (15 phút)
    );

    // Tạo Refresh Token
    const refreshToken = jwt.sign(
      { id: staff._id },
      process.env.JWT_REFRESH_SECRET, // secret key cho Refresh Token
      { expiresIn: "7d" } // Thời gian hết hạn của Refresh Token (7 ngày)
    );
    // Lưu Refresh Token vào database
    staff.refreshToken = refreshToken;
    await staff.save();

    // Trả về Access Token và Refresh Token cho client
    res.json({
      accessToken,
      refreshToken,
      username: staff.username,
      role: staff.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Hàm thay đổi mật khẩu
const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Lấy user từ token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );
    const staff = await Staff.findById(decoded.id);

    if (!staff) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Mã hóa mật khẩu mới và cập nhật
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    staff.password = hashedPassword;
    await staff.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token
    console.log(userId);
    const staff = await Staff.findById(userId);
    console.log(staff);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "Failed to fetch personal info", error });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ token (middleware authenticate)
    const { name, birthDay, phone, email, address, from } = req.body;

    // Tìm và cập nhật thông tin nhân viên
    const updatedStaff = await Staff.findByIdAndUpdate(
      userId,
      { name, birthDay, phone, email, address },
      { new: true, runValidators: true } // Trả về bản ghi mới nhất và validate dữ liệu
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật thành công", updatedStaff });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật thông tin" });
  }
};

const logout = async (req, res) => {
  try {
    // Nếu bạn lưu refreshToken trong DB, hãy xóa nó
    const token = req.body.refreshToken; // Lấy refreshToken từ request
    console.log(token);
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Tìm và xóa refreshToken trong database
    const result = await Staff.updateOne(
      { refreshToken: token },
      { refreshToken: null }
    );
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Refresh token not found" });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Failed to logout" });
  }
};
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body; // URL của avatar từ client
    const staffId = req.user.id; // Lấy ID nhân viên từ token

    // Kiểm tra nếu avatar không được gửi
    if (!avatar) {
      return res.status(400).json({ error: 'Avatar URL is required.' });
    }

    // Cập nhật avatar trong cơ sở dữ liệu
    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { avatar }, // Cập nhật trường avatar
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    // Nếu không tìm thấy nhân viên
    if (!updatedStaff) {
      return res.status(404).json({ error: 'Staff not found.' });
    }

    // Trả về kết quả thành công
    res.status(200).json({
      message: 'Avatar updated successfully.',
      updatedStaff,
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }

}
module.exports = {
  login,
  changePassword,
  getProfile,
  updateProfile,
  logout,
  updateAvatar,
};
