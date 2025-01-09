const Staff = require("../../models/user.models.js");

const addStaff = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      fullName,
      dateOfBirth,
      gender,
      position,
      salary,
      address,
    } = req.body;

    const newStaff = new Staff({
      username,
      email,
      phone,
      password,
      fullName,
      dateOfBirth,
      gender,
      position,
      salary,
      address,
      role: 'staff', 
    });

    await newStaff.save();
    res.status(201).json({ message: 'Staff added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add staff', error });
  }
};

const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find({ role: "staff" }); 
    res.status(200).json(staffs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve staff", error: error.message });
  }
};

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

const updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json({ message: "Staff updated successfully", updatedStaff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update staff" });
  }
};
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch staff" });
  }


}

module.exports = {
  addStaff,
  getAllStaffs,
  deleteStaff,
  updateStaff,
  getStaff,
};
