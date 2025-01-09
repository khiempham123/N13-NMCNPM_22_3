const User = require("../../models/user.models");

const getInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info", error });
  }
};

const editInfo = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, avatar, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, dateOfBirth, gender, avatar, address, phone },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user info", error });
  }
};

const getUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const skip = (page - 1) * limit;

    const users = await User.find({role : "customer"})
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(Number(limit)); 

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const updateCustomer = async (req, res) => {
    try {
      const { id } = req.params; 
      const { name, birthDay, email } = req.body; 
  
      const updatedCustomer = await User.findByIdAndUpdate(
        id, // ID khách hàng
        { fullName: name, dateOfBirth: birthDay, email },
        { new: true }
      );
  
      if (!updatedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      res.status(200).json(updatedCustomer); 
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Error updating customer", error });
    }
  };

  const deleteCustomer = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const deletedCustomer = await User.findByIdAndDelete(id);
  
      if (!deletedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      res.status(200).json({ message: "Customer deleted successfully", deletedCustomer });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Error deleting customer", error });
    }
  };
module.exports = { getInfo, editInfo,getUser, updateCustomer,deleteCustomer };

