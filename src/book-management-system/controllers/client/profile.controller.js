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

// Lấy danh sách tất cả người dùng và sắp xếp theo thời gian tạo
const getUser = async (req, res) => {
    try {
      // Lấy tất cả người dùng, sắp xếp theo `createdAt` (mới nhất trước)
      const users = await User.find().sort({ createdAt: -1 }); // -1: giảm dần, 1: tăng dần
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users2", error });
    }
  };

// Hàm cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL params
      const { name, birthDay, email } = req.body; // Lấy thông tin từ body request
  
      // Tìm và cập nhật thông tin khách hàng
      const updatedCustomer = await User.findByIdAndUpdate(
        id, // ID khách hàng
        { fullName: name, dateOfBirth: birthDay, email }, // Các trường cần cập nhật
        { new: true } // Trả về đối tượng đã cập nhật
      );
  
      if (!updatedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      res.status(200).json(updatedCustomer); // Trả về thông tin khách hàng đã cập nhật
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Error updating customer", error });
    }
  };

  const deleteCustomer = async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID khách hàng từ URL params
  
      // Tìm và xóa khách hàng trong database
      const deletedCustomer = await User.findByIdAndDelete(id);
  
      // Nếu không tìm thấy khách hàng, trả về lỗi 404
      if (!deletedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      // Trả về phản hồi thành công
      res.status(200).json({ message: "Customer deleted successfully", deletedCustomer });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Error deleting customer", error });
    }
  };
module.exports = { getInfo, editInfo,getUser, updateCustomer,deleteCustomer };

