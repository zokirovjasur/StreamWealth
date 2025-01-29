"use client";
import { useMemo } from "react";

export function useReportData(transactions) {
  return useMemo(() => {
    const monthlyData = new Array(12).fill(0).map(() => ({
      income: 0,
      expenses: 0,
    }));

    const categoryTotals = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        monthlyData[month].income += amount;
        totalIncome += amount;
      } else {
        monthlyData[month].expenses += amount;
        totalExpenses += amount;
        categoryTotals[transaction.category] =
          (categoryTotals[transaction.category] || 0) + amount;
      }
    });

    return {
      monthlyData,
      categoryTotals,
      totalIncome,
      totalExpenses,
      savingsRate: totalIncome
        ? ((totalIncome - totalExpenses) / totalIncome) * 100
        : 0,
    };
  }, [transactions]);
}
