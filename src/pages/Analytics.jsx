import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Analytics.css";

const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042", "#AA88FF", "#FF66CC", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];

const Analytics = () => {
  const [entries, setEntries] = useLocalStorage("journalEntries", []);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load spending categories
    fetch("/spending-category.json")
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories);
      })
      .catch(error => {
        console.error("Error loading categories:", error);
      });
  }, []);

  const getMonth = (dateStr) => new Date(dateStr).getMonth();

  // Filter entries for selected month
  const filteredEntries = selectedMonth === "All"
    ? entries
    : entries.filter((e) => getMonth(e.date) === parseInt(selectedMonth));

  const allTimeTotal = entries.reduce((acc, e) => acc + Number(e.amount), 0);
  const monthTotal = filteredEntries.reduce((acc, e) => acc + Number(e.amount), 0);

  // Pie chart: spending by category (filtered by selected month)
  const categoryData = filteredEntries.reduce((acc, curr) => {
    const found = acc.find((a) => a.category === curr.category);
    if (found) {
      found.amount += Number(curr.amount);
    } else {
      acc.push({ category: curr.category, amount: Number(curr.amount) });
    }
    return acc;
  }, []);

  // Line chart: spending over time (all time and selected month)
  const lineData = entries.reduce((acc, curr) => {
    const date = new Date(curr.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const found = acc.find((a) => a.month === monthYear);
    if (found) {
      found.allTime += Number(curr.amount);
      if (selectedMonth === "All" || getMonth(curr.date) === parseInt(selectedMonth)) {
        found.selectedMonth += Number(curr.amount);
      }
    } else {
      acc.push({ 
        month: monthYear, 
        allTime: Number(curr.amount),
        selectedMonth: (selectedMonth === "All" || getMonth(curr.date) === parseInt(selectedMonth)) ? Number(curr.amount) : 0
      });
    }
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="analytics-page">
      <h2>📊 Analytics Dashboard</h2>

      <div className="analytics-dropdowns">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="All">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      <div className="info-boxes">
        <div className="box green">
          <div>🟢 Total Spending (All Time)</div>
          <h3>THB {allTimeTotal.toLocaleString()}</h3>
        </div>
        <div className="box yellow">
          <div>🟡 Total Spending (Selected Month)</div>
          <h3>THB {monthTotal.toLocaleString()}</h3>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h4>📈 Spending Over Time</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="allTime" 
                stroke="#8884d8" 
                name="All Time Spending"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="selectedMonth" 
                stroke="#82ca9d" 
                name="Selected Month Spending"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>📉 Spending by Category</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ category, amount }) => `${category}: THB ${amount.toLocaleString()}`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `THB ${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
