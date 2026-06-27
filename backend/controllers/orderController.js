import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { transporter } from "../config/nodemailer.js";

// Helper: send email notifications
const sendOrderPlacedEmail = async (email, order) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"L\'Arôme Parfums" <noreply@larome.com>',
            to: email,
            subject: `L'Arôme Parfums - Order Placed Successfully! (ID: ${order._id})`,
            html: `
                <div style="font-family: 'Outfit', sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 8px;">
                    <h1 style="color: #111; text-align: center; font-family: 'Prata', serif; border-bottom: 2px solid #c5a880; padding-bottom: 15px; margin-top: 0;">L'ARÔME LUXURY PARFUMS</h1>
                    <p>Dear Valued Customer,</p>
                    <p>Thank you for shopping with L'Arôme. Your order has been placed successfully and is being prepared by our fragrance concierges.</p>
                    <div style="background-color: #faf9f6; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #c5a880;">
                        <h3 style="margin-top: 0; font-family: 'Prata', serif;">Order Details:</h3>
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
                        <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. ${order.amount}</p>
                        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}</p>
                    </div>
                    <p>We will notify you once your exquisite scent is shipped.</p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
                    <p style="font-size: 11px; color: #888; text-align: center; margin-bottom: 0;">Copyright 2026 @ larome.com. All rights reserved.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Failed to send Order Placed email:", error);
    }
};

const sendOrderStatusEmail = async (email, order, status) => {
    try {
        let subject = `L'Arôme Parfums - Order Status Update`;
        let statusTitle = `Order Status Update`;
        let statusMessage = `Your order status has been updated to <strong>${status}</strong>.`;

        if (status === "Shipped") {
            subject = `L'Arôme Parfums - Your Fragrance has Shipped! 🚀`;
            statusTitle = `Your Fragrance has Shipped!`;
            statusMessage = `Your order (ID: ${order._id}) has been carefully packaged and handed over to our premium courier service. It is now on its way to you.`;
        } else if (status === "Delivered") {
            subject = `L'Arôme Parfums - Order Delivered! 🎁`;
            statusTitle = `Delivered!`;
            statusMessage = `Your luxury scent has been delivered! We hope it brings a touch of magic to your day. We would love to hear your feedback, please consider leaving a review on our website.`;
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || '"L\'Arôme Parfums" <noreply@larome.com>',
            to: email,
            subject: subject,
            html: `
                <div style="font-family: 'Outfit', sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 8px;">
                    <h1 style="color: #111; text-align: center; font-family: 'Prata', serif; border-bottom: 2px solid #c5a880; padding-bottom: 15px; margin-top: 0;">L'ARÔME LUXURY PARFUMS</h1>
                    <h2 style="color: #c5a880; font-family: 'Prata', serif; font-size: 20px; text-align: center;">${statusTitle}</h2>
                    <p>Hello,</p>
                    <p>${statusMessage}</p>
                    <div style="background-color: #faf9f6; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #c5a880;">
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> ${status}</p>
                        <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${order.address.street}, ${order.address.city}</p>
                    </div>
                    <p>If you have any questions, feel free to reply to this email to contact our fragrance concierge.</p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
                    <p style="font-size: 11px; color: #888; text-align: center; margin-bottom: 0;">Copyright 2026 @ larome.com. All rights reserved.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Failed to send Order ${status} email:`, error);
    }
};

// Place order using Cash on Delivery (COD)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const newOrder = new Order({
            userId,
            items,
            amount: Number(amount),
            address,
            status: "Order Placed",
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        });

        const order = await newOrder.save();

        // Decrement Product Stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -Number(item.quantity) } });
        }

        // Clear Cart
        await User.findByIdAndUpdate(userId, { cartData: {} });

        // Retrieve user email to send notification
        const user = await User.findById(userId);
        if (user && user.email) {
            await sendOrderPlacedEmail(user.email, order);
        }

        res.json({ success: true, message: "Order Placed Successfully", orderId: order._id });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Place order using Card (Stripe/Mock card)
const placeOrderCard = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Creating a paid order directly for mock checkout
        const newOrder = new Order({
            userId,
            items,
            amount: Number(amount),
            address,
            status: "Order Placed",
            paymentMethod: "Card",
            payment: true, // Marked as paid
            date: Date.now()
        });

        const order = await newOrder.save();

        // Decrement Product Stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -Number(item.quantity) } });
        }

        // Clear Cart
        await User.findByIdAndUpdate(userId, { cartData: {} });

        // Retrieve user email to send notification
        const user = await User.findById(userId);
        if (user && user.email) {
            await sendOrderPlacedEmail(user.email, order);
        }

        res.json({ success: true, message: "Order Placed Successfully via Card", orderId: order._id });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get User Orders (Customer)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders (Admin only)
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status (Admin only)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        // Retrieve user email to send status update notification
        const user = await User.findById(order.userId);
        if (user && user.email) {
            await sendOrderStatusEmail(user.email, order, status);
        }

        res.json({ success: true, message: "Order Status Updated" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderCard, userOrders, allOrders, updateStatus };
