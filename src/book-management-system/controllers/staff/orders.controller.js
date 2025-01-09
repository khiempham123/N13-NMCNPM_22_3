const Order = require("../../models/order.models");

const getAllOrders = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const orders = await Order.find()
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit);
        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order" });
    }
};

const createOrder = async (req, res) => {
    const { Name, Address, Total, Status } = req.body;
    try {
        const newOrder = new Order({ Name, Address, Total, Status });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: "Error creating order" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { Status } = req.body;
        const validStatuses = ['order received', 'processing', 'packed', 'shipped'];
        
        if (!validStatuses.includes(Status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { Status },
            { new: true } 
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status" });
    }
};


const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { userFullName, address, status } = req.body; 
    
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            userFullName,
            address,
            status,
          },
          { new: true } 
        );
    
        if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
        }
    
        res.status(200).json(updatedOrder);
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
    




module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    updateOrderStatus,
    updateOrder
};