const mongoose = require("mongoos");

const guestSchema = new mongoose.Schema({
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    }],
    eventId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required:true
    }],
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: string
    },
    group: {
        type: String
    },
    note: {
        type: String
    }
}, { timestamps: true });

const Guest = mongoose.model("Guest", guestSchema);
module.exports = Guest;