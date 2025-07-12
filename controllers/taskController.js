const express = require("express");
const router = express.Router({ mergeParams: true });

const Task = require("../models/task");
const Event = require("../models/event");
const UserVendor = require("../models/userVendor");

//I.N.D.U.C.E.S

// Index  - Show all tasks
router.get("/", async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        const tasks = await Task.find({ eventId });
        res.render("tasks/index.ejs", { event, tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading tasks.");
    }
});

//New - Show new task form
router.get("/new", async (req, res) => {
    const { eventId } = req.params;
    try {
        const vendors = await UserVendor.find({ eventId });
        res.render("tasks/new.ejs", { eventId, vendors });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading new task form.");
    }
});

//Delete - Delete existing task
router.delete("/:taskId", async (req, res) => {
    const { eventId, taskId } = req.params;
    try {
        await Task.findByIdAndDelete(taskId);
        res.redirect(`/events/${eventId}/tasks`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete task.");
    }
});

//Update - Update existing task
router.put("/:taskId", async (req, res) => {
    const { eventId, taskId } = req.params;
    try {
        await Task.findByIdAndUpdate(taskId, req.body);
        res.redirect(`/events/${eventId}/tasks`);
    } catch (err) {
        console.error(err);
        res.status(400).send("Failed to update task.");
    }
});

//Create - Creation of new task
router.post("/", async (req, res) => {
    const { eventId } = req.params;
    try {
        const newTask = new Task({
            ...req.body,
            eventId,
            userId: req.session.user._id
        });
        await newTask.save();
        res.redirect(`/events/${eventId}/tasks`);
    } catch (err) {
        console.error(err);
        res.status(400).send("Failed to create task.");
    }
});

//Edit - Show edit task form
router.get("/:taskId/edit", async (req, res) => {
    const { eventId, taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        const vendors = await UserVendor.find({ eventId });
        res.render("tasks/edit.ejs", { eventId, task, vendors });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading task edit form.");
    }
});

//Show - Show single task
router.get("/:taskId", async (req, res) => {
    const { eventId, taskId } = req.params;
    try {
        const task = await Task.findById(taskId).populate("vendorId");
        res.render("tasks/show.ejs", { eventId, task });
    } catch (err) {
        console.error(err);
        res.status(404).send("Task not found.");
    }
});

module.exports = router;