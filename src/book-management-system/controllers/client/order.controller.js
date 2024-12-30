const Order = require("../../models/order.models.js");
const Cart = require("../../models/cart.models.js");
const mongoose = require("mongoose");

// GET: Lấy danh sách các đơn hàng hoặc chi tiết đơn hàng cụ thể
const getOrders = async (req, res) => {
  try {
    const { orderId, status, page = 1, limit = 5 } = req.query; // Thêm page và limit
    const userId = req.user.id;

    // Nếu `orderId` được cung cấp, trả về chi tiết đơn hàng
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId })
        .populate("items.bookId")
        .exec();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    }

    // Xây dựng query object
    const query = { userId };
    if (status && status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    // Tính toán `skip` dựa trên `page` và `limit`
    const skip = (page - 1) * limit;

    // Fetch danh sách đơn hàng với phân trang
    const orders = await Order.find(query)
      .populate("items.bookId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .exec();
  
    // Tổng số đơn hàng
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
    const userId = req.user.id;

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
    const userId = req.user.id; // Giả sử middleware authenticate đã gắn thông tin người dùng vào req.user
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


const countOrders = async (req, res) => {
  try {
    // Giả sử bạn có mô hình Order trong cơ sở dữ liệu
    const totalOrders = await Order.countDocuments(); // MongoDB example
    res.json({ total: totalOrders });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }


}
const totalShiped = async (req, res) => {
  try {
    // Truy vấn các đơn hàng có trạng thái 'shipped'
    const shippedOrders = await Order.find({  status: 'Shipped' } );
    // Tính tổng tiền
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