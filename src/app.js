const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.model");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Root Directory");
});

//Index Route
app.get("/Listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings: allListings });
});

//new Route
app.get("/Listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/Listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing: listing });
});

// Post Route
app.post("/Listing", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();

  res.redirect("/Listing");
});

// Edit Route
app.get("/Listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: listing });
});

// Update Route
app.put("/Listing/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/Listing/${id}`);
})

// delete Route
app.delete("/Listing/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/Listing");
})

module.exports = app;
