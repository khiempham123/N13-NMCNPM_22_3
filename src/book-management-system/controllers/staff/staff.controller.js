const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Staff = require("../../models/user.models");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const staff = await Staff.findOne({ username });
    if (!staff) {
      return res.status(400).json({ message: "Username không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }

    const accessToken = jwt.sign(
      { id: staff._id, username: staff.username, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Tạo Refresh Token
    const refreshToken = jwt.sign(
      { id: staff._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    staff.refreshToken = refreshToken;
    await staff.save();

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

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
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

    const isMatch = await bcrypt.compare(oldPassword, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

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
    const userId = req.user.id;
    const staff = await Staff.findById(userId);

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
    const userId = req.user.id;
    const { name, birthDay, phone, email, address, from } = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(
      userId,
      { name, birthDay, phone, email, address },
      { new: true, runValidators: true }
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
    const token = req.body.refreshToken;
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

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
    const { avatar } = req.body;
    const staffId = req.user.id;

    if (!avatar) {
      return res.status(400).json({ error: "Avatar URL is required." });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { avatar },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff not found." });
    }

    res.status(200).json({
      message: "Avatar updated successfully.",
      updatedStaff,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
module.exports = {
  login,
  changePassword,
  getProfile,
  updateProfile,
  logout,
  updateAvatar,
};
