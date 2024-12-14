const Order = require("../../models/order.models.js");
const Cart = require("../../models/cart.models.js");
const mongoose = require("mongoose");

// GET: Lấy danh sách các đơn hàng hoặc chi tiết đơn hàng cụ thể
const getOrders = async (req, res) => {
  try {
    const { orderId, status } = req.query; // Destructure status from query
    const userId = req.user._id;

    // If `orderId` is provided, return specific order details
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId })
        .populate("items.bookId")
        .exec();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    }

    // Build query object based on status
    const query = { userId };
    if (status && status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    // Fetch orders based on the query
    const orders = await Order.find(query).populate("items.bookId").exec();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

const getOrderCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const statuses = ["pending", "processing", "completed", "cancelled"];
    const counts = {};

    // Fetch counts for each status
    for (const status of statuses) {
      counts[status] = await Order.countDocuments({
        userId: userId,
        status: status,
      });
    }

    // Calculate total
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    res.status(200).json({ total, ...counts });
  } catch (error) {
    console.error("Error fetching order counts:", error);
    res.status(500).json({ message: "Failed to fetch order counts", error });
  }
};

// POST: Tạo đơn hàng mới
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

    // Lấy userId từ token (middleware gán thông tin user vào req.user)
    const userId = req.user._id;

    // Tạo đối tượng order mới
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

    // Lưu order vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    // Sau khi tạo đơn hàng thành công, xóa giỏ hàng
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

// Function để xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Giả sử middleware authenticate đã gắn thông tin người dùng vào req.user
    const { orderId } = req.params;

    // Kiểm tra định dạng orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    // Tìm đơn hàng
    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be deleted" });
    }

    // Xóa đơn hàng
    await Order.deleteOne({ _id: orderId });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

module.exports = {
  getOrders,
  getOrderCounts,
  createOrder,
  deleteOrder,
};
