"use client";
import { useMemo } from "react";
import { useTransactions } from "../store/TransactionContext";

export function useTransactionStats() {
  const { state } = useTransactions();

  return useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = state.transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const totalIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    const categoryTotals = monthlyTransactions.reduce((acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      }
      return acc;
    }, {});

    return {
      totalIncome,
      totalExpenses,
      balance,
      categoryTotals,
    };
  }, [state.transactions]);
}
