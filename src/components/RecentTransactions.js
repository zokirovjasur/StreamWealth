'use client';
import React, { useMemo } from 'react';
import { useTransactions } from '../store/TransactionContext';

export default function RecentTransactions() {
  const { state, deleteTransaction } = useTransactions();
  
  const recentTransactions = useMemo(() => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [state.transactions]);

  return (
    <div className="light-theme-card rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </div>
      <div className="divide-y">
        {recentTransactions.map(transaction => (
          <div key={transaction.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${
                transaction.type === 'income' ? 'text-success' : 'text-danger'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {state.settings.currency} {Number(transaction.amount).toFixed(2)}
              </span>
              <button 
                onClick={() => deleteTransaction(transaction.id)}
                className="text-gray-400 hover:text-danger"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}