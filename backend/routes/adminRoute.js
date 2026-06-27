import express from 'express';
import { getAdminAnalytics } from '../controllers/adminController.js';
import { getAdminLogs } from '../controllers/logController.js';
import { authAdmin } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/analytics', authAdmin, getAdminAnalytics);
adminRouter.post('/logs', authAdmin, getAdminLogs);

export default adminRouter;
