'use client';
import React, { useState, useCallback } from 'react';
import { useTransactions } from '../store/TransactionContext';

export default function TransactionForm({ transaction, onClose }) {
  const { state, addTransaction, updateTransaction } = useTransactions();
  const [formData, setFormData] = useState(transaction || {
    type: 'expense',
    amount: '',
    description: '',
    category: state.categories[0],
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const transactionData = {
      ...formData,
      id: formData.id || Date.now(),
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    if (transaction) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
  }, [formData, transaction, addTransaction, updateTransaction, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="light-theme-card rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {state.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-secondary hover:bg-blue-600 text-white py-2 rounded"
            >
              {transaction ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}