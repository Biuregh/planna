const express = require("express");
const router = express.Router({ mergeParams: true });
const UserVendor = require("../models/uservendor");
const Vendor = require("../models/vendor");

//I.N.D.U.C.E.S

// Index - List all linked vendors for an event
router.get("/", async (req, res) => {
    const { eventId } = req.params;
    try {
        const userVendors = await UserVendor.find({ eventId }).populate("vendorId");
        res.render("userVendors/index.ejs", { userVendors, eventId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading user vendors");
    }
});

// New - Show form to link an existing vendor
router.get("/new", async (req, res) => {
    const { eventId } = req.params;
    try {
        const vendors = await Vendor.find({});
        res.render("userVendors/new.ejs", { vendors, eventId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading vendor selection");
    }
});

// Delete - Remove a user-vendor link
router.delete("/:id", async (req, res) => {
    const { eventId } = req.params;
    try {
        await UserVendor.findByIdAndDelete(req.params.id);
        res.redirect(`/events/${eventId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error removing vendor link");
    }
});

// Update - Update notes, totalCost, contractFile, or rate of the link
router.put("/:id", async (req, res) => {
    const { eventId } = req.params;
    try {
        await UserVendor.findByIdAndUpdate(req.params.id, {
            notes: req.body.notes,
            totalCost: req.body.totalCost,
            contractFile: req.body.contractFile || [],
            rate: req.body.rate,
        });
        res.redirect(`/events/${eventId}/vendors`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating vendor link");
    }
});

// Create - Link an existing vendor to the event
router.post("/", async (req, res) => {
    const { eventId } = req.params;
    const userId = req.session.user;
    const { vendorId, notes, totalCost, contractFile, rate } = req.body;

    try {
        if (!vendorId) {
            return res.status(400).send("Please select a vendor.");
        }

        const vendorExists = await Vendor.findById(vendorId);
        if (!vendorExists) {
            return res.status(400).send("Selected vendor does not exist.");
        }

        const userVendor = new UserVendor({
            userId,
            eventId,
            vendorId,
            notes,
            totalCost,
            contractFile: contractFile || [],
            rate,
        });

        await userVendor.save();
        res.redirect(`/events/${eventId}/vendors`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error linking vendor to event");
    }
});

// Edit - Show form to edit a linked vendor's info
router.get("/:id/edit", async (req, res) => {
    const { eventId, id } = req.params;
    try {
        const vendors = await Vendor.find({});
        const userVendor = await UserVendor.findById(id);
        if (!userVendor) return res.status(404).send("UserVendor not found");
        res.render("userVendors/edit.ejs", { userVendor, eventId, vendors });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit form");
    }
});

// Show - Display details of a linked vendor
router.get("/:id", async (req, res) => {
    const { eventId, id } = req.params;
    try {
        const userVendor = await UserVendor.findById(id).populate("vendorId");
        if (!userVendor) return res.status(404).send("UserVendor not found");
        res.render("userVendors/show.ejs", { userVendor, eventId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving vendor link");
    }
});

module.exports = router;