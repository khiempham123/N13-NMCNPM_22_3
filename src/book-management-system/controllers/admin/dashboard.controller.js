const express = require("express");
const mongoose = require("mongoose");
const Order = require("../../models/order.models.js");


const getReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
    
        // Đảm bảo có ngày bắt đầu và kết thúc
        if (!startDate || !endDate) {
          return res.status(400).json({ message: "Start date and end date are required." });
        }
    
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Tìm các đơn hàng `shiped` trong khoảng thời gian và tính tổng tiền
        const revenueData = await Order.aggregate([
          {
            $match: {
              status: "Shipped",
              updatedAt: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
              }, // Nhóm theo ngày
              totalRevenue: { $sum: "$grandTotal" }, // Tổng doanh thu của ngày
            },
          },
          {
            $match: { _id: { $ne: null } }, // Loại bỏ nhóm có `_id: null`
          },
          {
            $sort: { _id: 1 }, // Sắp xếp tăng dần theo ngày
          },
        ]);
    
        res.status(200).json(revenueData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        res.status(500).json({ message: "Failed to fetch revenue data", error });
      }




}


module.exports = {
    getReport,
  };