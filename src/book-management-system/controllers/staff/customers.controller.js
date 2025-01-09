const Customer = require("../../models/user.models");

const getAllCustomers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const customers = await Customer.find()
            .skip(skip)
            .limit(limit);
        const totalCustomers = await Customer.countDocuments();

        res.status(200).json({
            totalCustomers,
            totalPages: Math.ceil(totalCustomers / limit),
            currentPage: page,
            customers,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers" });
    }
};

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

const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer" });
    }
};

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
