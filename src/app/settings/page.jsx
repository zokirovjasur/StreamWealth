"use client";
import React, { useState, useCallback } from "react";
import { useTransactions } from "../../store/TransactionContext";

export default function Settings() {
  const { state, dispatch } = useTransactions();
  const [newCategory, setNewCategory] = useState("");

  const handleCurrencyChange = useCallback(
    (currency) => {
      dispatch({
        type: "UPDATE_SETTINGS",
        payload: { ...state.settings, currency },
      });
    },
    [dispatch, state.settings]
  );

  const handleThemeChange = useCallback(
    (theme) => {
      dispatch({
        type: "UPDATE_SETTINGS",
        payload: { ...state.settings, theme },
      });
      // Apply theme to document
      document.documentElement.setAttribute("data-theme", theme);
    },
    [dispatch, state.settings]
  );

  const addCategory = useCallback(() => {
    if (newCategory && !state.categories.includes(newCategory)) {
      dispatch({
        type: "ADD_CATEGORY",
        payload: newCategory,
      });
      setNewCategory("");
    }
  }, [newCategory, state.categories, dispatch]);

  const deleteCategory = useCallback(
    (category) => {
      if (confirm("Are you sure? This might affect existing transactions.")) {
        dispatch({
          type: "DELETE_CATEGORY",
          payload: category,
        });
      }
    },
    [dispatch]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Currency Settings */}
      <div className="light-theme-card rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Currency Settings</h2>
        <select
          value={state.settings.currency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="UZS">UZS (💰)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      {/* Theme Settings */}
      <div className="light-theme-card rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Theme Settings</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleThemeChange("light")}
            className={`px-4 py-2 rounded ${
              state.settings.theme === "light"
                ? "bg-secondary text-white"
                : "bg-gray-200"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`px-4 py-2 rounded ${
              state.settings.theme === "dark"
                ? "bg-secondary text-white"
                : "bg-gray-200"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Category Management */}
      <div className="light-theme-card rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Category Management</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="p-2 border rounded flex-1"
          />
          <button
            onClick={addCategory}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {state.categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span>{category}</span>
              <button
                onClick={() => deleteCategory(category)}
                className="text-danger hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="light-theme-card rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <div className="space-y-4">
          {/* Export Data */}
          <div>
            <h3 className="text-sm font-medium mb-2">Export Data</h3>
            <button
              onClick={() => {
                const data = JSON.stringify(state);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "finance-tracker-backup.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full bg-secondary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Download Backup
            </button>
          </div>

          {/* Reset Data */}
          <div>
            <h3 className="text-sm font-medium mb-2">Reset Data</h3>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to reset all data? This cannot be undone!"
                  )
                ) {
                  dispatch({
                    type: "RESTORE_DATA",
                    payload: {
                      transactions: [],
                      categories: [
                        "Food",
                        "Transport",
                        "Entertainment",
                        "Bills",
                        "Other",
                      ],
                      settings: {
                        currency: "USD",
                        theme: "light",
                      },
                    },
                  });
                  alert("All data has been reset.");
                }
              }}
              className="w-full bg-danger text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
