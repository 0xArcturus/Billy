const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());




// Initial state
let sharedState = {
  users: [
     "Arturo", "Alberto", "Bea", "Cris", "Elo", 
    "Fran", "Hanan", "Joaquín", "Jorge", "Lucas", 
    "Maca", "Manu", "Marta", "Noelia", "Pablo", "Pedro",
]
,
  expenses: [
    { name: "Pizza", price: 30, participants: [] },
    { name: "Pasta", price: 20, participants: [] },
    { name: "Drinks", price: 15, participants: [] },
  ],
};

// Handle real-time connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send the current state to the new user
  socket.emit("updateState", sharedState);

  // Handle updates from clients
  socket.on("updateExpenses", (newExpenses) => {
    sharedState.expenses = newExpenses;
    io.emit("updateState", sharedState); // Broadcast updated state
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

 
  socket.on("addExpense", (newExpense) => {
    sharedState.expenses.push(newExpense);
    io.emit("updateState", sharedState); // Broadcast updated state
});
});

app.get("/state", (req, res) => {
  res.json(sharedState);
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
