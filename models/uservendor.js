const mongoose = require("mongoose");

const userVendorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    notes: String,
    totalCost: Number,
    contractFile: [String],
    rate: {
        type: Number,
        min: 1,
        max: 5
    }
},
    { timestamps: true });

const UserVendor = mongoose.models.UserVendor || mongoose.model("UserVendor", userVendorSchema);
module.exports = UserVendor;