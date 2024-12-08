const Customer = require("../../models/customers");

// Lấy tất cả khách hàng
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers" });
    }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer" });
    }
};

// Thêm mới một khách hàng
const createCustomer = async (req, res) => {
    const { Name, BirthDay, Email } = req.body;

    try {
        const newCustomer = new Customer({ Name, BirthDay, Email });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(400).json({ message: "Error adding customer" });
    }
};

// Cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Trả về tài nguyên đã được cập nhật
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer" });
    }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer" });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
