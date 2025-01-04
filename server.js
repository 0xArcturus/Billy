const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

// Initial state
let sharedState = {
  users: [
    "Arturo", "Alberto", "Bea", "Cris", "Elo",
    "Fran", "Hanan", "Joaquín", "Jorge", "Lucas",
    "Maca", "Manu", "Marta", "Noelia", "Pablo", "Ruben",
  ],
  expenses: [
    { name: "Pizza", price: 30, participants: [] },
    { name: "Pasta", price: 20, participants: [] },
    { name: "Drinks", price: 15, participants: [] },
  ],
};

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("updateState", sharedState);

  socket.on("updateExpenses", (newExpenses) => {
    sharedState.expenses = newExpenses;
    io.emit("updateState", sharedState);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// API route to get state
app.get("/state", (req, res) => {
  res.json(sharedState);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
