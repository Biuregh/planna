const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
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
        ref: "UserVendor",
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['todo', 'in progress', 'done'],
        default: 'todo'
    },
    category: String,
    dueDate: Date,
    assignedTo: String
},
    { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;