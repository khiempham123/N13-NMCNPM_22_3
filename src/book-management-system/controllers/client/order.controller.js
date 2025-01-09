const Order = require("../../models/order.models.js");
const Cart = require("../../models/cart.models.js");
const mongoose = require("mongoose");

const getOrders = async (req, res) => {
  try {
    const { orderId, status, page = 1, limit = 5 } = req.query; 
    const userId = req.user.id;

    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId })
        .populate("items.bookId")
        .exec();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    }

    const query = { userId };
    if (status && status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("items.bookId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .exec();
  
    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

const getOrderCounts = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const statuses = ["pending", "processing", "completed", "cancelled"];
    const counts = {};

    for (const status of statuses) {
      counts[status] = await Order.countDocuments({
        userId: userId,
        status: status,
      });
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    res.status(200).json({ total, ...counts });
  } catch (error) {
    console.error("Error fetching order counts:", error);
    res.status(500).json({ message: "Failed to fetch order counts", error });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      userFullName,
      address,
      items,
      totalAmount,
      shippingFee,
      grandTotal,
    } = req.body;

    const userId = req.user.id;

    const newOrder = new Order({
      userId,
      userFullName,
      address,
      items,
      totalAmount,
      shippingFee,
      grandTotal,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be deleted" });
    }

    await Order.deleteOne({ _id: orderId });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};


const countOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); 
    res.json({ total: totalOrders });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }


}
const totalShiped = async (req, res) => {
  try {
    const shippedOrders = await Order.find({  status: 'Shipped' } );
    const totalShipped = shippedOrders.reduce((sum, order) => sum + order.grandTotal, 0);

    res.json({ totalShipped });
} catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error calculating total shipped orders' });
}


}



module.exports = {
  getOrders,
  getOrderCounts,
  createOrder,
  deleteOrder,
  countOrders,
  totalShiped,
};