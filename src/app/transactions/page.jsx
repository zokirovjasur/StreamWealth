"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useTransactions } from "../../store/TransactionContext";
import TransactionForm from "../../components/TransactionForm";

function TransactionRow({ transaction }) {
  const { state, deleteTransaction } = useTransactions();
  const { settings } = state;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        {new Date(transaction.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">{transaction.description}</td>
      <td className="px-6 py-4">{transaction.category}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            transaction.type === "income"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {transaction.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={
            transaction.type === "income" ? "text-success" : "text-danger"
          }
        >
          {settings.currency} {Number(transaction.amount).toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={() => window.editTransaction(transaction.id)}
            className="text-secondary hover:text-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="text-danger hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Transactions() {
  const { state } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    dateRange: "all",
  });

  // Initialize global handlers
  useEffect(() => {
    window.editTransaction = (id) => {
      const transaction = state.transactions.find((t) => t.id === id);
      if (transaction) {
        setEditingTransaction(transaction);
        setShowForm(true);
      }
    };
  }, [state.transactions]);

  // Memoize filtered transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((t) => {
      const matchesSearch = t.description
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === "all" || t.category === filters.category;
      const matchesType = filters.type === "all" || t.type === filters.type;

      if (filters.dateRange === "all")
        return matchesSearch && matchesCategory && matchesType;

      const transactionDate = new Date(t.date);
      const today = new Date();

      switch (filters.dateRange) {
        case "today":
          return (
            transactionDate.toDateString() === today.toDateString() &&
            matchesSearch &&
            matchesCategory &&
            matchesType
          );
        case "week":
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          return (
            transactionDate >= weekAgo &&
            matchesSearch &&
            matchesCategory &&
            matchesType
          );
        case "month":
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear() &&
            matchesSearch &&
            matchesCategory &&
            matchesType
          );
        default:
          return matchesSearch && matchesCategory && matchesType;
      }
    });
  }, [state.transactions, filters]);

  // Memoize sorted transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="p-2 border rounded"
        />

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="all">All Categories</option>
          {state.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="light-theme-card rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}
