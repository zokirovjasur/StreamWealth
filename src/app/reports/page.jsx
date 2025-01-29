'use client';
import React, { useState, useCallback, useMemo } from 'react'; // Added useMemo import
import { useTransactions } from '../../store/TransactionContext';
import { useReportData } from '../../hooks/useReportData';
import MonthlyChart from '../../components/charts/MonthlyChart';
import CategoryChart from '../../components/charts/CategoryChart';

export default function Reports() {
  const { state } = useTransactions();
  const [year, setYear] = useState(new Date().getFullYear());
  
  const yearlyTransactions = useMemo(() => {
    return state.transactions.filter(t => {
      return new Date(t.date).getFullYear() === year;
    });
  }, [state.transactions, year]);

  const { monthlyData, categoryTotals, totalIncome, totalExpenses, savingsRate } = useReportData(yearlyTransactions);

  const handleYearChange = useCallback((e) => {
    setYear(Number(e.target.value));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <select 
          value={year} 
          onChange={handleYearChange}
          className="p-2 border rounded"
        >
          {[...Array(5)].map((_, i) => {
            const yearOption = new Date().getFullYear() - i;
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="light-theme-card p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Income</h3>
          <p className="text-2xl font-bold text-success">
            {state.settings.currency} {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="light-theme-card p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Expenses</h3>
          <p className="text-2xl font-bold text-danger">
            {state.settings.currency} {totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="light-theme-card p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Net Savings</h3>
          <p className="text-2xl font-bold text-secondary">
            {state.settings.currency} {(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
        <div className="light-theme-card p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Savings Rate</h3>
          <p className="text-2xl font-bold text-primary">
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="light-theme-card p-4 rounded-lg shadow">
          <MonthlyChart monthlyData={monthlyData} />
        </div>
        <div className="light-theme-card p-4 rounded-lg shadow">
          <CategoryChart categoryTotals={categoryTotals} />
        </div>
      </div>
    </div>
  );
}