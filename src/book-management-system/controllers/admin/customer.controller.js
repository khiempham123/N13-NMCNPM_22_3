const User = require("../../models/user.models.js");
const Order = require("../../models/order.models.js");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.aggregate([
      {
        $match: {
          role: "customer",
        },
      },
      {
        $lookup: {
          from: "orders",
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

const resetCustomerPassword = async (req, res) => {
  const { id } = req.params;
  const { isConfirm } = req.body;

  if (!isConfirm) {
    return res.status(400).json({ message: "Reset password not confirmed" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const newPassword = "123456789";
    user.password = newPassword;

    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCustomerAccount = async (req, res) => {
  const { id } = req.params;
  const { isConfirm } = req.body;

  if (!isConfirm) {
    return res.status(400).json({ message: "Delete action not confirmed" });
  }

  try {
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
  resetCustomerPassword,
  deleteCustomerAccount,
};
