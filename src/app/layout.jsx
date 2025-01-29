'use client';
import { TransactionProvider } from '../store/TransactionContext';
import Navigation from '../components/Navigation';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TransactionProvider>
          <div className="min-h-screen">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </TransactionProvider>
      </body>
    </html>
  );
}