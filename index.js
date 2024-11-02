const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const userRoute = require("./routes/user.route.js");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// routes
app.use("/api/user", userRoute);




app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT || 9001, () => console.log("server is running on port 9001"));
  })
  .catch((err) => {
    console.log("Connection failed!",err);
  });
