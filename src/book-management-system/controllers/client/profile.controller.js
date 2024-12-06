const User = require("../../models/user.models");

// Lấy thông tin người dùng (dựa trên user đã xác thực từ middleware)
const getInfo = async (req, res) => {
  try {
    // Lấy thông tin người dùng từ request (được thêm vào từ middleware)
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info", error });
  }
};

// Cập nhật thông tin người dùng
const editInfo = async (req, res) => {
  try {
    // Lấy thông tin mới từ body request
    const { fullName, dateOfBirth, gender, avatar, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Dùng _id người dùng từ token
      { fullName, dateOfBirth, gender, avatar, address, phone },
      { new: true } // Trả về đối tượng đã cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user info", error });
  }
};

module.exports = { getInfo, editInfo };
