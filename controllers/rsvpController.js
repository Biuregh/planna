const express = require("express");
const router = express.Router({ mergeParams: true });

const RSVP = require("../models/rsvp");
const Guest = require("../models/guest");

//I.N.D.U.C.E.S

// Index  - Show all rsvp
router.get("/", async (req, res) => {
    const { eventId } = req.params;
    try {
        const guestIds = await Guest.find({ eventId }).distinct("_id");
        const rsvps = await RSVP.find({ guestId: { $in: guestIds } }).populate("guestId");
        res.render("rsvps/index.ejs", {
            eventId,
            rsvps
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading RSVPs");
    }
});

//New - Show new rsvp form
router.get("/new", async (req, res) => {
    const { eventId } = req.params;
    const guests = await Guest.find({ eventId });
    res.render("rsvps/new.ejs", { eventId, guests });
});

//Delete - Delete existing rsvp
router.delete("/:rsvpId", async (req, res) => {
    await RSVP.findByIdAndDelete(req.params.rsvpId);
    res.redirect(`/events/${req.params.eventId}/rsvps`);
});

//Update - Update existing rsvp
router.put("/:rsvpId", async (req, res) => {
    const { attending, mealChoice } = req.body;
    await RSVP.findByIdAndUpdate(req.params.rsvpId, {
        attending,
        mealChoice,
    });
    res.redirect(`/events/${req.params.eventId}/rsvps`);
});

//Create - Creation of new rsvp
router.post("/", async (req, res) => {
    const { guestId, attending, mealChoice } = req.body;
    try {
        await RSVP.create({
            guestId,
            attending,
            mealChoice,
            respondedAt: new Date()
        });

        res.redirect(`/events/${req.params.eventId}/rsvps`);
    } catch (err) {
        console.error(err);
        res.status(400).send("Failed to create RSVP: " + err.message);
    }
});


//Edit - Show edit rsvp form
router.get("/:rsvpId/edit", async (req, res) => {
    const rsvp = await RSVP.findById(req.params.rsvpId).populate("guestId");
    res.render("rsvps/edit.ejs", { rsvp });
});

//Show - Show single rsvp
router.get("/:rsvpId", async (req, res) => {
    const rsvp = await RSVP.findById(req.params.rsvpId).populate("guestId");
    res.render("rsvps/show.ejs", { rsvp });
});

module.exports = router;