const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.model");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/css")));

app.get("/", (req, res) => {
  res.send("Root Directory");
});

//Index Route
app.get("/Listing",wrapAsync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings: allListings });
}));

//new Route
app.get("/Listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/Listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing: listing });
}));

// Create Route
app.post(
  "/Listing",
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.body.listing);

    await newListing.save();

    res.redirect("/Listing");
  }),
);

// Edit Route
app.get("/Listing/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: listing });
}));

// Update Route
app.put("/Listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/Listing/${id}`);
}));

// delete Route
app.delete("/Listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/Listing");
}));


app.use((req,res,next)=>{
  next(new ExpressError(404, "Page Not Found"))
})
app.use((err, req, res, next) => {
  let {statusCode=500, message="Something Went wrong"} =err;
  res.status(statusCode).send(message);
  // res.send("Something went wrong");
});

module.exports = app;
