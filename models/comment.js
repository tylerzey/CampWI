const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
});
// Export object model to main file
module.exports = mongoose.model("Comment", commentSchema);
