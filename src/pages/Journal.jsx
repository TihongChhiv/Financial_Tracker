import React, { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";
import "./Journal.css";

const Journal = () => {
  const [entry, setEntry] = useState({ date: "", category: "", amount: "" });
  const [entries, setEntries] = useLocalStorage("journalEntries", []);
  const [categories, setCategories] = useLocalStorage("customCategories", []);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // 🔁 Load spending categories from JSON file
  useEffect(() => {
    fetch("/spending-category.json")
      .then(response => response.json())
      .then(data => {
        // Merge predefined categories with custom categories
        const allCategories = [...data.categories, ...categories];
        setCategories(allCategories);
      })
      .catch(error => {
        console.error("Error loading categories:", error);
        // Fallback categories
        const fallbackCategories = [
          "Food & Dining",
          "Transportation", 
          "Shopping",
          "Entertainment",
          "Healthcare",
          "Education",
          "Housing",
          "Utilities",
          "Insurance",
          "Travel",
          "Personal Care",
          "Gifts",
          "Subscriptions",
          "Investments",
          "Savings"
        ];
        const allCategories = [...fallbackCategories, ...categories];
        setCategories(allCategories);
      });
  }, []);

  const handleAdd = () => {
    if (!entry.date || !entry.category || !entry.amount) {
      alert("Please fill in all fields!");
      return;
    }
    
    if (isNaN(entry.amount) || Number(entry.amount) <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const newEntry = { ...entry };
    const updated = [...entries, newEntry];
    setEntries(updated);
    setEntry({ date: "", category: "", amount: "" });
    setCustomCategory("");
    setShowCustomInput(false);
  };

  const handleDelete = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "custom") {
      setShowCustomInput(true);
      setEntry({ ...entry, category: "" });
    } else {
      setShowCustomInput(false);
      setEntry({ ...entry, category: e.target.value });
    }
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
    setEntry({ ...entry, category: e.target.value });
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      const updatedCategories = [...categories, customCategory.trim()];
      setCategories(updatedCategories);
    }
  };

  const total = entries.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="journal-page" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>📘 Spending Journal</h2>

      <div style={{ width: "100%", maxWidth: "700px", padding: "2rem", background: "#fff", borderRadius: "1rem", marginBottom: "1.5rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <label>
          📅 Date:
          <input
            type="date"
            value={entry.date}
            onChange={(e) => setEntry({ ...entry, date: e.target.value })}
            style={{ width: "100%", marginTop: "0.25rem", padding: "0.5rem", marginBottom: "1rem" }}
            required
          />
        </label>
        
        <label>
          🍔 Category:
          <select
            value={entry.category}
            onChange={handleCategoryChange}
            style={{ width: "100%", marginTop: "0.25rem", padding: "0.5rem", marginBottom: "1rem" }}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
            <option value="custom">➕ Add Custom Category</option>
          </select>
        </label>

        {showCustomInput && (
          <div className="custom-category-section">
            <label>
              ✏️ Custom Category:
              <input
                type="text"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                placeholder="Enter custom category name"
              />
            </label>
            <button
              onClick={addCustomCategory}
              className="save-category-btn"
            >
              Save Category
            </button>
          </div>
        )}

        <label>
          💸 Amount (THB):
          <input
            type="number"
            value={entry.amount}
            onChange={(e) => setEntry({ ...entry, amount: e.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
            style={{ width: "100%", marginTop: "0.25rem", padding: "0.5rem", marginBottom: "1rem" }}
            required
          />
        </label>
        
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "0.75rem",
            width: "100%",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➕ Add Entry
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "700px", backgroundColor: "#e1ffe1", padding: "1.25rem", borderRadius: "1rem", textAlign: "center", fontWeight: "bold", marginBottom: "2rem", fontSize: "1.5rem" }}>
        💰 Total Spending: THB {total.toLocaleString()}
      </div>

      <div style={{ width: "100%", maxWidth: "900px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "1rem", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f8f8" }}>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Date</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Category</th>
              <th style={{ padding: "0.75rem", textAlign: "right" }}>Amount</th>
              <th style={{ padding: "0.75rem", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.75rem" }}>{e.date}</td>
                <td style={{ padding: "0.75rem" }}>{e.category}</td>
                <td style={{ padding: "0.75rem", textAlign: "right" }}>THB {Number(e.amount).toLocaleString()}</td>
                <td style={{ padding: "0.75rem", textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(i)}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "1rem", color: "#888" }}>No entries yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Journal;
