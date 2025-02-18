
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ParticipationPage from "./pages/ParticipationPage";
import SummaryPage from "./pages/SummaryPage";
import ExpenseBlobInput from "./components/ExpenseBlobInput";

const socket = io("https://billy-production-7f73.up.railway.app");


const App = () => {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("participation");

  useEffect(() => {
    // Ensure state updates correctly from backend
    socket.on("updateState", (state) => {
      setUsers(state?.users || []); // Default to an empty array if undefined
      setExpenses(state?.expenses || []); // Default to an empty array if undefined
    });
  
    return () => {
      socket.off("updateState");
    };
  }, []);
  

  const updateExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    socket.emit("updateExpenses", newExpenses); // Send updates to the backend
  };
  const handleResetClick = () => {
    const updatedExpenses = [];
     

    setExpenses(updatedExpenses);
    socket.emit("updateExpenses", updatedExpenses); // Notify server
  };
  return (
    
    <div>
        {currentUser === users[0] && (
      <div>
        <button onClick={() => handleResetClick()} style={{ color: "red", marginTop: "20px" }}>
          Reset All Data
        </button>
      </div>
    )}
    {currentUser === users[0] && (
        <ExpenseBlobInput expenses={expenses} setExpenses={setExpenses} socket={socket} />
      )}
    
      {currentPage === "participation" && (
        <ParticipationPage
          users={users}
          expenses={expenses}
          setExpenses={updateExpenses}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          socket={socket}
        />
      )}
      {currentPage === "summary" && (
        <SummaryPage
          users={users}
          expenses={expenses}
          currentUser={currentUser}
        />
      )}
      <button onClick={() => setCurrentPage("participation")}>
        Go to Participation
      </button>
      <button onClick={() => setCurrentPage("summary")}>Go to Summary</button>
    </div>
  );
};

export default App;
