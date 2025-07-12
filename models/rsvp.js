const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
        required: true
    },
    attending: {
        type: String,
        enum: ["yes", "no", "pending"],
        default: "pending",
        required: true
    },
    mealChoice: {
        type: String
    }
}, { timestamps: true });

const RSVP = mongoose.model("RSVP", rsvpSchema);
module.exports = RSVP;
