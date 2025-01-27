const mongoose = require("mongoose");
const planSchema = new mongoose.Schema({
  destination: String,
  startDate: Date,
  endDate: Date,
  activities: Array,
});

const Plans = mongoose.model("plans", planSchema);
module.exports = Plans;
