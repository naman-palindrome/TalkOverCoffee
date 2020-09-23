const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    trim: true,
  },
});

module.exports = mongoose.model("Story", StorySchema);
