const express = require("express");
const router = express.Router();

const Event = require("../models/event");

//I.N.D.U.C.E.S

// Index  - Show ll events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find({ userId: req.session.user._id });
        res.render("events/index.ejs", { events });
    } catch (err) {
        res.status(500).send("Error loading events!");
    }
});

//New - Show new events form
router.get("/new", (req, res) => {
    res.render("events/new.ejs");
});

//Delete - Delete existing product
router.delete("/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect("/events");
    } catch (err) {
        res.status(500).send("Error deleting event!");
    }
});

//Update - Update existing event
router.put("/:id", async (req, res) => {
    try {
        const { name, date, location, notes } = req.body;
        await Event.findByIdAndUpdate(req.params.id, {
            name,
            date,
            location,
            notes,
        });
        res.redirect(`/events`);
    } catch (err) {
        res.status(500).send("Error on updating event!");
    }
});

//Create - Creation of new event
router.post("/", async (req, res) => {
    try {
        const { name, date, location, notes } = req.body;
        await Event.create({
            name,
            date,
            location,
            notes,
            userId: req.session.user._id
        });
        res.redirect("/events");
    } catch (err) {
        res.status(500).send("Error creating events!")
    }
});

//Edit - Show edit event form
router.get("/:id/edit", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render("events/edit.ejs", { event });
    } catch (err) {
        res.status(500).send("Error loading edit form");
    }
});

//Show - Show single event
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render("events/show.ejs", { event });
    } catch (err) {
        res.status(500).send("Error showing single event!");
    }
});

module.exports = router;
