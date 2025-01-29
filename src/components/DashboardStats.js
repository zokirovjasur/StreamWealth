'use client';
import React from 'react';
import { useTransactionStats } from '../hooks/useTransactionStats';
import { useTransactions } from '../store/TransactionContext';

export default function DashboardStats() {
  const { totalIncome, totalExpenses, balance, categoryTotals } = useTransactionStats();
  const { state } = useTransactions();
  const currency = state.settings.currency;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="light-theme-card rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Monthly Income</h3>
        <p className="text-2xl font-bold text-success">
          {currency} {totalIncome.toFixed(2)}
        </p>
      </div>
      
      <div className="light-theme-card rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Monthly Expenses</h3>
        <p className="text-2xl font-bold text-danger">
          {currency} {totalExpenses.toFixed(2)}
        </p>
      </div>
      
      <div className="light-theme-card rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Net Balance</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
          {currency} {balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}