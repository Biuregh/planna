const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String
    },
    notes: {
        type: String
    },
    budget:  Number,

}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;