const Discount = require("../../models/discounts");

// Hàm lấy danh sách giảm giá với phân trang
const getAllDiscounts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const discounts = await Discount.find()
            .skip(skip)
            .limit(limit);
        const totalDiscounts = await Discount.countDocuments();

        res.status(200).json({
            totalDiscounts,
            totalPages: Math.ceil(totalDiscounts / limit),
            currentPage: page,
            discounts,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching discounts" });
    }
};

// Lấy giảm giá theo ID
const getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id).populate("bookId");
        if (!discount) {
            return res.status(404).json({ message: "Discount not found" });
        }
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: "Error fetching discount" });
    }
};

// Thêm mới một giảm giá
const createDiscount = async (req, res) => {
    const { bookId, discountPrice, originalPrice, discountPercentage, startDate, endDate, maxQuantity } = req.body;
    try {
        const newDiscount = new Discount({
            bookId,
            discountPrice,
            originalPrice,
            discountPercentage,
            startDate,
            endDate,
            maxQuantity,
        });
        await newDiscount.save();
        res.status(201).json(newDiscount);
    } catch (error) {
        res.status(400).json({ message: "Error adding discount" });
    }
};

// Cập nhật giảm giá
const updateDiscount = async (req, res) => {
    try {
        const updatedDiscount = await Discount.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Trả về tài nguyên đã được cập nhật
        );
        if (!updatedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }
        res.status(200).json(updatedDiscount);
    } catch (error) {
        res.status(500).json({ message: "Error updating discount" });
    }
};


// Xóa giảm giá
const deleteDiscount = async (req, res) => {
    try {
        const deletedDiscount = await Discount.findByIdAndDelete(req.params.id);
        if (!deletedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }
        res.status(200).json(deletedDiscount);
    } catch (error) {
        res.status(500).json({ message: "Error deleting discount" });
    }
};

module.exports = {
    getAllDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount,
};
