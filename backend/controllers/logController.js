import AdminLog from "../models/AdminLog.js";

const getAdminLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find({}).sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, logs });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAdminLogs };
