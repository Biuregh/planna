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
    vendord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserVendor",
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

const UserVendor = mongoose.model("UserVendor", userVendorSchema);
module.exports = UserVendor;