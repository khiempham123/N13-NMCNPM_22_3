const Staff = require("../../models/staff");

// Lấy tất cả nhân viên
const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff" });
    }
};

// Lấy nhân viên theo ID
const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff" });
    }
};

// Thêm nhân viên mới
const createStaff = async (req, res) => {
    const { name, birthDay, phone, email, livingIn, from, position, salary, workingTime, dayOff, levelOfExperience, timekeeping } = req.body;

    try {
        const newStaff = new Staff({
            name,
            birthDay,
            phone,
            email,
            livingIn,
            from,
            position,
            salary,
            workingTime,
            dayOff,
            levelOfExperience,
            timekeeping,
        });
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (error) {
        res.status(400).json({ message: "Error adding staff" });
    }
};

// Cập nhật thông tin nhân viên
const updateStaff = async (req, res) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: "Error updating staff" });
    }
};

// Xóa nhân viên
const deleteStaff = async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting staff" });
    }
};

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
};