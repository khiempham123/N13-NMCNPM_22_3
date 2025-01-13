const express = require("express");
const mongoose = require("mongoose");
const Order = require("../../models/order.models.js");


const getReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
    
        if (!startDate || !endDate) {
          return res.status(400).json({ message: "Start date and end date are required." });
        }
    
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        const revenueData = await Order.aggregate([
          {
            $match: {
              status: "shipped",
              updatedAt: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
              }, 
              totalRevenue: { $sum: "$grandTotal" }, 
            },
          },
          {
            $match: { _id: { $ne: null } }, 
          },
          {
            $sort: { _id: 1 }, 
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