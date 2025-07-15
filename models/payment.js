const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
    userVendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserVendor",
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ["deposit", "installment", "final"],
        required: true
    },
    instalmentNumber: Number,
    totalInstalment: Number,
    dueDate: Date,
    paidDate: Date,
    status: {
        type: String,
        enum: ["pending", "paid", "cancelled", "refunded", "overdue"],
        defult: "pending"
    },
    notes: String,
},
    { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;