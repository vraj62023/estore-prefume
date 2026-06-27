import express from 'express';
import { placeOrder, placeOrderCard, userOrders, allOrders, updateStatus } from '../controllers/orderController.js';
import { authUser, authAdmin } from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/place-card', authUser, placeOrderCard);
orderRouter.post('/user-orders', authUser, userOrders);

// Admin routes
orderRouter.post('/list', authAdmin, allOrders);
orderRouter.post('/status', authAdmin, updateStatus);

export default orderRouter;
