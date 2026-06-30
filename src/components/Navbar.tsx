import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-transparent z-30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top navigation">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
                <BookOpen className="text-brand" size={20} />
              </div>
              <span className="font-bold text-lg text-white">Soma365</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white hover:underline">Home</Link>
            <a href="#features" className="text-white hover:underline">Features</a>
            <a href="#pricing" className="text-white hover:underline">Pricing</a>
            <a href="#docs" className="text-white hover:underline">Docs</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm font-medium text-brand">{user.full_name ? user.full_name.charAt(0) : 'U'}</div>
                <button onClick={() => logout()} className="text-white bg-white/10 px-3 py-1 rounded-lg">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-brand px-4 py-2 rounded-lg font-medium">Sign in</Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu" className="text-white bg-white/10 p-2 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white/5 rounded-lg p-4">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-white">Home</Link>
              <a href="#features" className="text-white">Features</a>
              <a href="#pricing" className="text-white">Pricing</a>
              <a href="#docs" className="text-white">Docs</a>
              {user ? (
                <button onClick={() => logout()} className="text-white text-left">Logout</button>
              ) : (
                <Link to="/login" className="text-white">Sign in</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
