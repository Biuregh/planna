const express = require("express");
const router = express.Router();

const Event = require("../models/event");
const RSVP = require("../models/rsvp");
const Task = require("../models/task");
const Payment = require("../models/payment");
const User = require("../models/user");
const Guest = require("../models/guest")

router.get("/dashboard", async (req, res) => {
    try {

        const userId = req.session.user._id;
        const user = await User.findById(userId);

        const events = await Event.find({ userId: { $in: [userId] } });

        const dashboardData = await Promise.all(events.map(async (event) => {
            const guests = await Guest.find({eventId: event._id});
            const guestIds = guests.map((guest)=>{
                return guest._id
            })
            const guestCount = guestIds.length;
            const rsvps = await RSVP.find({ guestId: { $in: guestIds}});
            const tasks = await Task.find({ eventId: event._id, status:{ $ne: "done"} }).sort("dueDate");
            const payments = await Payment.find({ eventId: event._id });

            const rsvpStats = {
                confirmed: rsvps.filter(r => r.attending === "confirmed").length,
                declined: rsvps.filter(r => r.attending === "declined").length,
                pending: rsvps.filter(r => r.attending === "pending").length
            };

            const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
            const budget = event.budget || 0;
            const budgetRemaining = budget - totalPayments;

            return {
                event,
                rsvpStats,
                tasks,
                payments,
                totalPayments,
                budget,
                budgetRemaining,
                daysLeft: Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)),
                guestCount
            };
        }));
        res.render("dashboard.ejs", { user, dashboardData });

    } catch (err) {
        res.status(500).send("Dashboard error");
    }
});

module.exports = router;
