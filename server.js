require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const authController = require("./controllers/auth.js");
const eventController = require("./controllers/eventController.js");
const guestController = require("./controllers/guestController.js");
const rsvpController = require("./controllers/rsvpController");
const taskController = require("./controllers/taskController.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.use("/auth", authController);
app.use("/events", eventController);
app.use(guestController);
app.use("/events/:eventId/rsvps", rsvpController);
app.use("/events", taskController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});