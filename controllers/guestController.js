const express = require("express");
const router = express.Router();

const Guest = require("../models/guest");
const Event = require("../models/event");

//I.N.D.U.C.E.S

// Index - Show all guests
router.get("/events/:eventId/guests", async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId)
        const guests = await Guest.find({
            userId: req.session.user._id,
            eventId: eventId
        });
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.render("guest/index.ejs", { guests, event });
    } catch (err) {
        res.status(500).send("Error in showing all guests");
    }
});

//New - Show new guest form
router.get("/events/:eventId/guests/new", (req, res) => {
    const { eventId } = req.params;
    res.render("guest/new.ejs", { eventId });
});

//Delete - Delete existing guest
router.delete("/guest/:id", async (req, res) => {
    try {
        const guest = await Guest.findByIdAndDelete(req.params.id);
        if (!guest) {
            return res.status(404).send("Guest not found");
        }
        res.redirect(`/events/${guest.eventId}/guests`);
    } catch (err) {
        console.error("============>", err)
        res.status(500).send("Error deleting guest");
    }
});

//Update - Update existing guest
router.put("/guest/:id", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, group, note } = req.body;
        const guest = await Guest.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, phone, group, note },
            { new: true }
        );
        res.redirect(`/events/${guest.eventId}/guests`);
    } catch (err) {
        res.status(500).send("Error updating guest");
    }
});

//Create - Creation of new guest
router.post("/events/:eventId/guests", async (req, res) => {
    try {
        const guestData = {
            userId: req.session.user._id,
            eventId: req.params.eventId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            group: req.body.group,
            note: req.body.note
        };
        await Guest.create(guestData);
        res.redirect(`/events/${req.params.eventId}/guests`);
    } catch (err) {
        console.error("Error creating guest:", err);  // Log error for debugging
        res.status(500).send("Error creating guest");
    }
});

//Edit - Show edit guest form
router.get("/guest/:id/edit", async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) return res.status(404).send("Guest not found");
        res.render("guest/edit.ejs", { guest });
    } catch (err) {
        res.status(500).send("Error loading edit form");
    }
});

//Show - Show single guest
router.get("/guest/:id", async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) return res.status(404).send("Guest not found");
        res.render("guest/show.ejs", { guest });
    } catch (err) {
        res.status(500).send("Error loading guest");
    }
});

module.exports = router;