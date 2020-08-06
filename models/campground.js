const mongoose = require("mongoose");
Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Export object model to main file
module.exports = mongoose.model("Campground", campgroundSchema);

// Pre hook to make sure we delete all associated comments when a campground is deleted
campgroundSchema.pre("remove", async function () {
  await Comment.remove({
    _id: {
      $in: this.comments,
    },
  });
});
