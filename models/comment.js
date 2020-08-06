const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  createdAt: { type: Date, default: Date.now },
  text: String,
});
// Export object model to main file
module.exports = mongoose.model("Comment", commentSchema);
