const express = require("express");
const router = express.Router({ mergeParams: true });

const RSVP = require("../models/rsvp");
const Guest = require("../models/guest");
const Event = require("../models/event");


//I.N.D.U.C.E.S

// Index  - Show all rsvp
router.get("/", async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        const guests = await Guest.find({ eventId });
        for (const guest of guests) {
            const existingRsvp = await RSVP.findOne({ guestId: guest._id });
            if (!existingRsvp) {
                await RSVP.create({
                    guestId: guest._id,
                    attending: "pending"
                });
            }
        }
        const guestIds = guests.map(g => g._id);
        const rsvps = await RSVP.find({ guestId: { $in: guestIds } }).populate("guestId");
        res.render("rsvp/index.ejs", {
            event,
            rsvps
        });
    } catch (err) {
        res.status(500).send("Error loading RSVPs");
    }
});

// Update - Update existing RSVP
router.put("/:rsvpId", async (req, res) => {
    const { attending, mealChoice } = req.body;
    try {
        await RSVP.findByIdAndUpdate(req.params.rsvpId, {
            attending,
            mealChoice,
        });
        res.redirect(`/events/${req.params.eventId}/rsvps`);
    } catch (err) {
        res.status(500).send("Error updating RSVP");
    }
});

// Create- Post new RSVP
router.post("/", async (req, res) => {
    const { eventId } = req.params;
    const { guestId, attending, mealChoice } = req.body;
    try {
        const existingRsvp = await RSVP.findOne({ guestId });
        if (existingRsvp) {
            return res.redirect(`/events/${eventId}/rsvps`);
        }
        await RSVP.create({
            guestId,
            attending: attending || "pending", 
            mealChoice
        });
        res.redirect(`/events/${eventId}/rsvps`);
    } catch (err) {
        res.status(500).send("Error creating RSVP");
    }
});

//Edit - Show edit rsvp form
router.get("/:rsvpId/edit", async (req, res) => {
    const rsvp = await RSVP.findById(req.params.rsvpId).populate("guestId");
    res.render("rsvp/edit.ejs", { rsvp });
});

//Show - Show single rsvp
router.get("/:rsvpId", async (req, res) => {
    const rsvp = await RSVP.findById(req.params.rsvpId).populate("guestId");
    res.render("rsvp/show.ejs", { rsvp });
});

module.exports = router;