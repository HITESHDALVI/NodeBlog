const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
require("./db");
const authRouter = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use("/users", authRouter);

app.use("/blogs", blogRouter);

app.get("/", async (req, res) => {
  res.send("get request");
});

app.listen(PORT, () => {
  console.log(`server is running on Port ${PORT}`);
});
