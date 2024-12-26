const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    steps: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Data", DataSchema);
