const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    blog: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// blogSchema.pre("save", async function (next) {
//   const user = this;
//   if (!user.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
//   next();
// });
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
