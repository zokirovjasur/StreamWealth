"use client";
import { useState, useMemo, useCallback } from "react";

export function useTransactionFilters(transactions) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    dateRange: "all",
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesCategory =
        filters.category === "all" || t.category === filters.category;
      const matchesType = filters.type === "all" || t.type === filters.type;
      const matchesDate = checkDateRange(t.date, filters.dateRange);

      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });
  }, [transactions, filters]);

  return {
    filters,
    updateFilter,
    filteredTransactions,
  };
}

function checkDateRange(date, range) {
  const transactionDate = new Date(date);
  const today = new Date();

  switch (range) {
    case "today":
      return transactionDate.toDateString() === today.toDateString();
    case "week":
      const weekAgo = new Date(today.setDate(today.getDate() - 7));
      return transactionDate >= weekAgo;
    case "month":
      return (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    case "year":
      return transactionDate.getFullYear() === today.getFullYear();
    default:
      return true;
  }
}
