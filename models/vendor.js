const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: String,
    website: String,
    address: String,
    city: String,
    state: String,
    zip: Number,
    serviceType: {
        type: String,
        required: true
    },
    description: String,
    logo: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    claimed: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;