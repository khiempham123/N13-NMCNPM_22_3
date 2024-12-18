const Staff = require("../../models/staff.models.js");

// Thêm một staff mới
const addStaff = async (req, res) => {
  try {
    const { name, gender, position, salary, avatar } = req.body;

    const newStaff = new Staff({
      name,
      gender,
      position,
      salary,
      avatar,
    });

    await newStaff.save();
    res
      .status(201)
      .json({ message: "Staff added successfully", staff: newStaff });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add staff", error: error.message });
  }
};

// Lấy danh sách tất cả staff
const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.status(200).json(staffs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve staff", error: error.message });
  }
};

// Xóa staff
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete staff", error: error.message });
  }
};

// Sửa thông tin staff
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, position, salary, avatar } = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { name, gender, position, salary, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res
      .status(200)
      .json({ message: "Staff updated successfully", staff: updatedStaff });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update staff", error: error.message });
  }
};

module.exports = {
  addStaff,
  getAllStaffs,
  deleteStaff,
  updateStaff,
};
