const express = require("express");
const router = express.Router();
const Vendor = require("../models/vendor");

// I.N.D.U.C.E.S.

// Index - Show all vendors
router.get("/", async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        res.render("vendors/index.ejs", { vendors });
    } catch (err) {
        res.status(500).send("Error loading vendors");
    }
});

// New - Show form to create a new vendor
router.get("/new", (req, res) => {
    res.render("vendors/new.ejs");
});

// Delete - Remove existing vendor
router.delete("/:id", async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);
        res.redirect("/vendors");
    } catch (err) {
        res.status(500).send("Error deleting vendor");
    }
});

// Update - Update existing vendor
router.put("/:id", async (req, res) => {
    try {
        await Vendor.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/vendors/${req.params.id}`);
    } catch (err) {
        res.status(500).send("Error updating vendor");
    }
});

// Create - Creation of new vendor
router.post("/", async (req, res) => {
    try {
        const vendorData = {
            ...req.body,
            createdBy: req.session.user?._id || null
        };
        await Vendor.create(vendorData);
        res.redirect("/vendors");
    } catch (err) {
        res.status(500).send("Error creating vendor");
    }
});

// Edit - Show edit vendor form
router.get("/:id/edit", async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).send("Vendor not found");
        res.render("vendors/edit.ejs", { vendor });
    } catch (err) {
        res.status(500).send("Error loading vendor edit form");
    }
});

// Show - Show single vendor's detail
router.get("/:id", async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).send("Vendor not found");
        res.render("vendors/show.ejs", { vendor });
    } catch (err) {
        res.status(500).send("Error retrieving vendor");
    }
});

module.exports = router;