import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { mapUsersToRoom } from "./src/controllers/mapUsersToRoom.js";
import "./src/mongoose.js";
import userRouter from "./src/routes/user.js";
import roomRouter from "./src/routes/room.js";
import { createOrUpdateRoom } from "./src/controllers/roomController.js";
import dotenv from "dotenv"
import connectDB from "./src/mongoose.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(roomRouter);

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chess-game-1cwu.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

if (process.env.NODE_ENV === "production") {
  const prodDirname = path.resolve();
  app.use(express.static(path.join(prodDirname, "/chess-web/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(prodDirname, "chess-web", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

var waitingUsers = [];

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    waitingUsers.push({ username: data.username, socket: socket });
    waitingUsers = mapUsersToRoom(waitingUsers);
  });

  socket.on("send_data", async (data) => {
    await createOrUpdateRoom(data);

    socket.to(data.roomid).emit("recieve_room_data", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("recieve_chat_message", data);
  });

  socket.on("send_check_mate_data", (data) => {
    socket.to(data.roomId).emit("recieve_check_mate_data", data);
  });

  socket.on("reconnection", (data) => {
    socket.join(data.roomId);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data.roomId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.get("/", async (req, res) => {
  res.send("api is running");
});

server.listen(process.env.PORT || 3001);
