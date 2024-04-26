const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blogs");
const nodemailer = require("nodemailer");
const auth = require("../middleware/auth");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post("/create-blog", auth, async (req, res) => {
  try {
    const owner = req.user._id;
    const { title, blog } = req.body;
    const blogPost = new Blog({
      blog,
      title,
      owner,
    });
    await blogPost.save();

    res.json({
      message: "Blog created successfully",
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.get("/get-blog", auth, async (req, res) => {
  try {
    const blogPost = await Blog.find({});
    res.status(200).json({
      message: "Blog fetched successfully",
      blogs: blogPost,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.get("/get-blog/:title", auth, async (req, res) => {
  try {
    const { title } = req.body;
    const blogPost = await Blog.find({ title });
    res.status(200).json({
      message: "Blog fetched successfully",
      blogs: blogPost,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

router.patch("/update-blog/:id", auth, async (req, res) => {
  try {
    const { title, blog } = req.body;
    const blogPost = await Blog.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!blogPost) {
      return res.status(400).json({
        message: "Blog not found",
      });
    }
    blogPost.title = title;
    blogPost.blog = blog;
    await blogPost.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blogs: blogPost,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});
router.delete("/delete-blog/:id", auth, async (req, res) => {
  try {
    const blogPost = await Blog.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!blogPost) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    blogPost.title = title;
    blogPost.blog = blog;
    await blogPost.save();

    res.status(200).json({
      message: "Blog Deleted successfully",
      blogs: blogPost,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

module.exports = router;
