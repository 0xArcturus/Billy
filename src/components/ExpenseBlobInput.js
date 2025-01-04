import React, { useState } from "react";

const ExpenseBlobInput = ({ expenses, setExpenses, socket }) => {
  const [expenseBlob, setExpenseBlob] = useState("");

  const handleBlobSubmit = () => {
    try {
      // Parse the JSON blob input
      const parsedExpenses = JSON.parse(expenseBlob);

      // Validate the parsed data
      if (!Array.isArray(parsedExpenses)) {
        alert("Invalid format: Input must be an array of expense objects.");
        return;
      }

      const formattedExpenses = parsedExpenses.map((expense) => {
        if (!expense.name || typeof expense.price !== "number") {
          throw new Error("Each expense must have a 'name' and a 'price'.");
        }
        return { ...expense, participants: [] }; // Ensure 'participants' field is empty
      });

      // Update the expenses state
      setExpenses(formattedExpenses);
      socket.emit("updateExpenses", formattedExpenses); // Notify server

      // Clear the input
      setExpenseBlob("");
      alert("Expenses updated successfully!");
    } catch (error) {
      alert(`Error parsing or validating expenses: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Import Expense Blob</h2>
      <textarea
        value={expenseBlob}
        onChange={(e) => setExpenseBlob(e.target.value)}
        placeholder='Enter expenses in JSON format, e.g., [{"name": "Pizza", "price": 30}, {"name": "Drinks", "price": 15}]'
        rows={5}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleBlobSubmit} style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px" }}>
        Add Blob
      </button>
    </div>
  );
};

export default ExpenseBlobInput;
