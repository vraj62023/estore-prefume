import Coupon from "../models/Coupon.js";
import AdminLog from "../models/AdminLog.js";

// Add a new coupon (Admin only)
const addCoupon = async (req, res) => {
    try {
        const { code, discountPercent, adminUser } = req.body;
        
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.json({ success: false, message: "Coupon code already exists" });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountPercent: Number(discountPercent),
            isActive: true
        });
        await coupon.save();

        // Log admin activity
        const log = new AdminLog({
            action: "CREATE_COUPON",
            user: adminUser || "Admin System",
            details: `Created coupon "${code.toUpperCase()}" with ${discountPercent}% discount.`
        });
        await log.save();

        res.json({ success: true, message: "Coupon created successfully", coupon });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// List all coupons
const listCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Toggle coupon active state (Admin only)
const toggleCoupon = async (req, res) => {
    try {
        const { couponId, adminUser } = req.body;
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.json({ success: false, message: "Coupon not found" });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        // Log admin activity
        const log = new AdminLog({
            action: "TOGGLE_COUPON",
            user: adminUser || "Admin System",
            details: `Toggled coupon "${coupon.code}" active status to: ${coupon.isActive}.`
        });
        await log.save();

        res.json({ success: true, message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`, coupon });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete coupon (Admin only)
const deleteCoupon = async (req, res) => {
    try {
        const { couponId, adminUser } = req.body;
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.json({ success: false, message: "Coupon not found" });
        }

        await Coupon.findByIdAndDelete(couponId);

        // Log admin activity
        const log = new AdminLog({
            action: "DELETE_COUPON",
            user: adminUser || "Admin System",
            details: `Deleted coupon "${coupon.code}".`
        });
        await log.save();

        res.json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Validate a coupon (Public/Customer)
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        
        if (!coupon) {
            return res.json({ success: false, message: "Invalid coupon code" });
        }
        if (!coupon.isActive) {
            return res.json({ success: false, message: "This coupon is currently inactive" });
        }

        res.json({ 
            success: true, 
            discountPercent: coupon.discountPercent,
            message: `Coupon applied: ${coupon.discountPercent}% Off!`
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addCoupon, listCoupons, toggleCoupon, deleteCoupon, validateCoupon };
