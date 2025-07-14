const express = require("express");
const router = express.Router({ mergeParams: true });
const Payment = require("../models/payment");

//I.N.D.U.C.E.S

// Index - list all payments for a specific event
router.get("/", async (req, res) => {
  const { eventId } = req.params;
  try {
    const payments = await Payment.find({ eventId }).populate("userVendord");
    res.render("payments/index.ejs", { payments, eventId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading payments");
  }
});

// New - form to create a new payment
router.get("/vendors/:userVendorId/payments/new", async (req, res) => {
  const { eventId, userVendorId } = req.params;
  try {
    res.render("payments/new.ejs", { eventId, userVendorId });
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
    res.redirect(`/events/${eventId}/vendors/${userVendorId}/payments`);
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
    res.redirect(`/events/${eventId}/vendors/${userVendorId}/payments/${paymentId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating payment");
  }
});

// Create - post new payment
router.post("/", async (req, res) => {
  const { eventId, userVendorId } = req.params;
  const userId = req.session.user?._id;
  try {
    const payment = new Payment({
      userId,
      eventId,
      userVendord: userVendorId,
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
    res.redirect(`/events/${eventId}/vendors/${userVendorId}/payments`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating payment");
  }
});

// Edit - form to edit a payment
router.get("/:paymentId/edit", async (req, res) => {
  const { eventId, userVendorId, paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    res.render("payments/edit.ejs", { payment, eventId, userVendorId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading payment edit form");
  }
});

// Show - show a single payment
router.get("/:paymentId", async (req, res) => {
  const { eventId, userVendorId, paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    res.render("payments/show.ejs", { payment, eventId, userVendorId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error showing payment");
  }
});

module.exports = router;