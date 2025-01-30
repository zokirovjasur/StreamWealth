'use client';
import React, { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransactions } from '../store/TransactionContext';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useTransactions();

  // Memoized navigation handler
  const navigate = useCallback((path) => {
    router.push(path);
  }, [router]);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Finance Tracker</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/')}
                className={`px-3 py-2 rounded-md ${
                  pathname === '/' ? 'bg-secondary' : 'hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/transactions')}
                className={`px-3 py-2 rounded-md ${
                  pathname === '/transactions' ? 'bg-secondary' : 'hover:bg-gray-700'
                }`}
              >
                Transactions
              </button>
              <button 
                onClick={() => navigate('/reports')}
                className={`px-3 py-2 rounded-md ${
                  pathname === '/reports' ? 'bg-secondary' : 'hover:bg-gray-700'
                }`}
              >
                Reports
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className={`px-3 py-2 rounded-md ${
                  pathname === '/settings' ? 'bg-secondary' : 'hover:bg-gray-700'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
          <div className="text-sm">
            {state.settings.currency} | {state.settings.theme}
          </div>
        </div>
      </div>
    </nav>
  );
}