import React from "react";

const SummaryPage = ({
  users = [], // Default to an empty array if undefined
  expenses = [], // Default to an empty array if undefined
  currentUser,
}) => {
  const calculateTotals = () => {
    const userTotals = {};

    // Initialize totals for all users
    users.forEach((user) => {
      userTotals[user] = 0;
    });

    // Calculate totals based on participation
    expenses.forEach((expense) => {
      if (expense.participants.length > 0) {
        const perPersonShare = expense.price / expense.participants.length;
        expense.participants.forEach((participant) => {
          userTotals[participant] += perPersonShare;
        });
      }
    });

    return userTotals;
  };

  const calculateTotalExpenses = () => {
    // Sum up all expense prices
    return expenses.reduce((total, expense) => total + expense.price, 0);
  };

  const userTotals = calculateTotals();
  const totalExpenses = calculateTotalExpenses();

  return (
    <div>
      <h1>Summary</h1>
      <h2>Total Expenses: €{totalExpenses.toFixed(2)}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(userTotals)
          .filter(([_, total]) => total > 0) // Filter users with a total > 0
          .map(([user, total]) => (
            <li
              key={user}
              style={{
                color: user === currentUser ? "green" : "black", // Highlight logged-in user
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                margin: "5px 0",
              }}
            >
              {user}: €{total.toFixed(2)}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SummaryPage;
