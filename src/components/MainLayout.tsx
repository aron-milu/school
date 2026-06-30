import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const { user } = useAuth();

  return (
    <div className={`min-h-screen flex ${user ? 'bg-slate-50 text-slate-900' : 'bg-gradient-to-br from-brand to-gray-50 text-white'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-brand px-3 py-2 rounded-md shadow">
        Skip to content
      </a>

      <Sidebar />

      <div className="min-w-0 flex-1 overflow-auto">
        <main
          id="main"
          role="main"
          className={user ? 'min-h-screen' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
