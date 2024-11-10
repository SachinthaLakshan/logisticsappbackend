const express = require("express");
const mongoose = require("mongoose");
const directionRoute = require("./routes/direction.route.js");
const userRoute = require("./routes/user.route.js");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');


const allowedOrigins = [
  'http://localhost:3000', // Your first origin
  'https://logisticsapp-silk.vercel.app',     // Replace with your second origin
];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

dotenv.config();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// routes
app.use("/api/user", userRoute);
app.use("/api/direction", directionRoute);




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
