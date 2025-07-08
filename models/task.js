const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "Event",
        required: true
    },
    vendord: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "UserVendor",
        required: true
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
    assignedto: String
},
    { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;