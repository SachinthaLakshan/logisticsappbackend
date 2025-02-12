require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const directionRoute = require("./routes/direction.route.js");
const userRoute = require("./routes/user.route.js");
const adminRoute = require("./routes/admin.route.js");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Define Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://logisticsapp-silk.vercel.app",
];

// ✅ CORS Middleware (for Express)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow sending cookies/auth headers
  })
);

// ✅ Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Routes
app.use("/api/user", userRoute);
app.use("/api/direction", directionRoute);
app.use("/api/admin", adminRoute);

const onlineUsers = new Map();

// ✅ Socket.io Configuration
const io = new Server(server, {
  cors: {
    origin: ['*'],
    methods: ["GET", "POST"], // Allow GET and POST requests
    credentials: true, // Allow cookies/auth headers
  },
});

io.on("connection", (socket) => {
  console.log("New User Connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is now online with Socket ID: ${socket.id}`);
  });

  socket.on("sendNotification", ({ recipientId, message }) => {
    console.log("Sending notification to:", recipientId);
    const recipientSocketId = onlineUsers.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notification", { message });
      console.log("Notification sent to:", recipientSocketId);
    } else {
      console.log("Recipient is offline. Store notification in DB.");
      // Save notification to DB for later retrieval (optional)
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database!");
    server.listen(process.env.PORT || 9001, () =>
      console.log(`Server is running on port ${process.env.PORT || 9001}`)
    );
  })
  .catch((err) => {
    console.error("Database connection failed!", err);
    process.exit(1);
  });