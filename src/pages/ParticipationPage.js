import React, { useState } from "react";

const ParticipationPage = ({
  users = [], // Default to an empty array if undefined
  expenses = [], // Default to an empty array if undefined
  setExpenses,
  currentUser,
  setCurrentUser,
  socket,
}) => {
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpensePrice, setNewExpensePrice] = useState("");

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (!newExpenseName || !newExpensePrice) {
      alert("Please fill in both name and price.");
      return;
    }
    const newExpense = { name: newExpenseName, price: parseFloat(newExpensePrice), participants: [] };
    const updatedExpenses = [...expenses, newExpense];

    setExpenses(updatedExpenses);
    socket.emit("updateExpenses", updatedExpenses); // Notify server

    // Clear form inputs
    setNewExpenseName("");
    setNewExpensePrice("");
  };

  // Handle participation toggling
  const handleExpenseClick = (expenseIndex) => {
    const updatedExpenses = expenses.map((expense, index) => {
      if (index === expenseIndex) {
        const isParticipant = expense.participants.includes(currentUser);
        const updatedParticipants = isParticipant
          ? expense.participants.filter((user) => user !== currentUser)
          : [...expense.participants, currentUser];
        return { ...expense, participants: updatedParticipants };
      }
      return expense;
    });

    setExpenses(updatedExpenses);
    socket.emit("updateExpenses", updatedExpenses); // Notify server
  };

  //Handle deletion of Expenses
  const handleDeleteClick = (expenseIndex) => {
    // Create a new array without the expense at the given index
    const updatedExpenses = expenses.filter((_, index) => index !== expenseIndex);
  
   
    setExpenses(updatedExpenses);
    socket.emit("updateExpenses", updatedExpenses); // Notify the server of the change
  };
  

  // Check if current user is participating
  const isUserParticipating = (expense) => expense.participants.includes(currentUser);

  // Debugging logs
  console.log("Users:", users);
  console.log("Expenses:", expenses);

  return (
    <div>
      <h1>Bill Participation</h1>
      <UserSelector
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <div>
        <h2>Add New Expense</h2>
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpenseName}
          onChange={(e) => setNewExpenseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Expense Price"
          value={newExpensePrice}
          onChange={(e) => setNewExpensePrice(e.target.value)}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {expenses.map((expense, index) => {
          const isCurrentUserParticipating = isUserParticipating(expense);
          const itemStyle = {
            backgroundColor: isCurrentUserParticipating ? "lightgreen" : "white",
            padding: "10px",
            margin: "5px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          };

          return (
            <li
              key={index}
              style={itemStyle}
              onClick={() => handleExpenseClick(index)}
            >
              <div>
                <strong>{expense.name}</strong> - {expense.price.toFixed(2)}€
              </div>
              <div>
                Participants:{" "}
                {expense.participants.map((user) => (
                  <span key={user}>
                    {user}{" "}
                    {user === currentUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleExpenseClick(index);
                        }}
                        style={{
                          color: "red",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
                {currentUser === users[0] && (
                    <button
                        onClick={(e) => {
                        e.stopPropagation(); 
                        handleDeleteClick(index);
                        }}
                        style={{
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        }}
                        >
                            Delete Expense
                    </button>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const UserSelector = ({ users, currentUser, setCurrentUser }) => {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div>
      <button onClick={() => setShowSelector(!showSelector)}>
        Current User: {currentUser}
      </button>
      {showSelector && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user, index) => (
            <li
              key={index}
              onClick={() => setCurrentUser(user)}
              style={{
                cursor: "pointer",
                padding: "5px 10px",
                backgroundColor: user === currentUser ? "lightgray" : "white",
              }}
            >
              {user}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParticipationPage;
