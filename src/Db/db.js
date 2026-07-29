const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing.model");

async function connectedDb() {
  await mongoose.connect(
    "mongodb+srv://prashant:5ebDsfHk64W1umYx@cluster0.nuer57c.mongodb.net/wanderlust",
  );
  console.log("Db Connected");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("Data was initialized");
};

initDB();

module.exports = connectedDb;
