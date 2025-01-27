// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Plans = require("./model/plans");
const app = express();
const port = 3001;

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB using the URI stored in the .env file
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

main()
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  console.log("From the Server");
  res.send("Welcome to Travel Planner API");
});

// Get all plans
app.get("/plans", async (req, res) => {
  try {
    const plans = await Plans.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ message: "Error fetching plans", error });
  }
});


// Get a specific plan by ID
app.get("/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plans.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ message: "Error fetching plan", error });
  }
});

// Create a new plan
app.post("/plans", async (req, res) => {
  try {
    const { destination, startDate, endDate, activities } = req.body;

    if (!destination || !startDate || !endDate || !activities) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newPlan = new Plans({
      destination,
      startDate,
      endDate,
      activities,
    });

    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({
      message: "Error creating plan",
      error: error.message || error,
    });
  }
});

// Update a specific plan (PATCH)
app.patch("/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { destination, startDate, endDate, activities } = req.body;

    const updatedPlan = await Plans.findByIdAndUpdate(
      id,
      {
        destination,
        startDate,
        endDate,
        activities,
      },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: "Error updating plan", error });
  }
});


// Delete a specific plan (DELETE)
app.delete("/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlan = await Plans.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting plan", error });
  }
});


// Listening on the specified port
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
