const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const User = require("./schema.js");

const app = express();
const port = 3010;

app.use(express.json());

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});
const mongodb = process.env.DB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(mongodb);
    console.log(mongodb);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.log("Error in connecting mongodb...");
  }
};

connectDB();

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Invalid request" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
