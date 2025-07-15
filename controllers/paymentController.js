const express = require("express");
const router = express.Router({ mergeParams: true });
const Payment = require("../models/payment");
const UserVendor = require("../models/userVendor");
const Vendor = require("../models/vendor")
const Event = require("../models/event")
//I.N.D.U.C.E.S

// Index - list all payments for a specific event
router.get("/", async (req, res) => {
  const { eventId } = req.params;
  try {
    const userVendors = await UserVendor.find({ eventId }).populate("vendorId");
    const payments = await Payment.find({ eventId });
    
    res.render("payments/index.ejs", { eventId, userVendors, payments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading payments");
  }
});

// New - form to create a new payment
router.get("/new/:userVendorId", async (req, res) => {
  const { eventId, userVendorId } = req.params;
  try {
    const userVendor = await UserVendor.findById(userVendorId);
    const vendor = await Vendor.findOne(userVendor.vendorId);
    res.render("payments/new.ejs", { eventId, userVendorId, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error showing payment form");
  }
});

// Delete - remove payment
router.delete("/:paymentId", async (req, res) => {
  const { eventId, userVendorId, paymentId } = req.params;
  try {
    await Payment.findByIdAndDelete(paymentId);
    res.redirect(`/events/${eventId}/payments`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting payment");
  }
});

// Update - put updated payment info
router.put("/:paymentId", async (req, res) => {
  const { eventId, userVendorId, paymentId } = req.params;
  try {
    await Payment.findByIdAndUpdate(paymentId, {
      amount: req.body.amount,
      paymentType: req.body.paymentType,
      instalmentNumber: req.body.instalmentNumber,
      totalInstalment: req.body.totalInstalment,
      dueDate: req.body.dueDate,
      paidDate: req.body.paidDate,
      status: req.body.status,
      notes: req.body.notes,
    });
    res.redirect(`/events/${eventId}/payments`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating payment");
  }
});

// Create - post new payment
router.post("/:vendorId/:userVendorId", async (req, res) => {
  const { eventId, vendorId, userVendorId } = req.params;
  console.log(req.params)
  const userId = req.session.user?._id;
  try {
    const payment = new Payment({
      userId,
      eventId,
      userVendorId: userVendorId,
      vendorId: vendorId,
      amount: req.body.amount,
      paymentType: req.body.paymentType,
      instalmentNumber: req.body.instalmentNumber,
      totalInstalment: req.body.totalInstalment,
      dueDate: req.body.dueDate,
      paidDate: req.body.paidDate,
      status: req.body.status,
      notes: req.body.notes,
    });
    await payment.save();
    res.redirect(`/events/${eventId}/payments/${payment._id}/${userVendorId}`);
  } catch (err) {
    console.error(err);
  
    res.status(500).send("Error creating payment");
  }
});

// Edit - form to edit a payment
router.get("/:paymentId/edit/:userVendorId", async (req, res) => {
  const { eventId, paymentId, userVendorId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    res.render("payments/edit.ejs", { payment, eventId, userVendorId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading payment edit form");
  }
});

// Show - show a single payment
router.get("/:paymentId/:userVendorId", async (req, res) => {
  const { eventId, userVendorId, paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    const event = await Event.findById(eventId);
    console.log(req.params)
    res.render("payments/show.ejs", { payment, eventId, userVendorId, event });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error showing payment");
  }
});

module.exports = router;