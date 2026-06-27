import express from "express";
import { addCoupon, listCoupons, toggleCoupon, deleteCoupon, validateCoupon } from "../controllers/couponController.js";
import { authAdmin } from "../middleware/auth.js";

const couponRouter = express.Router();

couponRouter.post("/add", authAdmin, addCoupon);
couponRouter.get("/list", listCoupons);
couponRouter.post("/toggle", authAdmin, toggleCoupon);
couponRouter.post("/delete", authAdmin, deleteCoupon);
couponRouter.post("/validate", validateCoupon);

export default couponRouter;
