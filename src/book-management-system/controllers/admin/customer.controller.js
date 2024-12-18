const User = require("../../models/user.models.js");
const Order = require("../../models/order.models.js");
const bcrypt = require("bcryptjs");

// Lấy thông tin tất cả khách hàng
const getAllCustomers = async (req, res) => {
  try {
    // Tìm thông tin user và lấy tổng số đơn hàng cùng tổng tiền
    const customers = await User.aggregate([
      {
        $lookup: {
          from: "orders", // Tên collection "orders"
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalAmount: { $sum: "$orders.grandTotal" },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          phone: 1,
          email: 1,
          address: 1,
          avatar: 1,
          totalOrders: 1,
          totalAmount: 1,
        },
      },
    ]);

    return res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// Lấy thông tin chi tiết của một khách hàng
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "orders", // Tên collection "orders"
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalAmount: { $sum: "$orders.grandTotal" },
        },
      },
      {
        $project: {
          username: 1,
          fullName: 1,
          phone: 1,
          email: 1,
          address: 1,
          avatar: 1,
          totalOrders: 1,
          totalAmount: 1,
          orders: 1,
        },
      },
    ]);

    if (!customer.length) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(customer[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch customer" });
  }
};

// Reset mật khẩu khách hàng
const resetCustomerPassword = async (req, res) => {
  const { id } = req.params; // ID của khách hàng
  const { isConfirm } = req.body; // Cờ xác nhận từ người dùng

  if (!isConfirm) {
    return res.status(400).json({ message: "Reset password not confirmed" });
  }

  try {
    // Tìm khách hàng theo ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Hash mật khẩu mới (123456789)
    const newPassword = "123456789";
    user.password = newPassword;

    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Xóa tài khoản khách hàng
const deleteCustomerAccount = async (req, res) => {
  const { id } = req.params; // ID của khách hàng
  const { isConfirm } = req.body; // Cờ xác nhận từ người dùng

  if (!isConfirm) {
    return res.status(400).json({ message: "Delete action not confirmed" });
  }

  try {
    // Tìm và xóa khách hàng theo ID
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  resetCustomerPassword,
  deleteCustomerAccount,
};
