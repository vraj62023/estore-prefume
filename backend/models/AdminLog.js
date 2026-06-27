import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g. "CREATE_PRODUCT", "EDIT_PRODUCT", "DELETE_PRODUCT"
    user: { type: String, required: true }, // Admin email or name
    details: { type: String, required: true }, // Details like product name/id
    timestamp: { type: Date, default: Date.now }
});

const AdminLog = mongoose.models.AdminLog || mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;
