import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppData } from '../context/AppContext';

const Navbar = () => {
  const { user, logoutUser } = AppData();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transcation' },
    { label: 'Settings', path: '/setting' },
    { label: 'Profile', path: '/profile' },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-[#0A2540] border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">₹</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Paytem <span className="text-sky-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-800/60">WALLET</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5">2FA & CSRF Protected</p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side: User Profile & Logout */}
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
                {userInitial}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">
                  {user?.name || 'Account Holder'}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium leading-none">● Authenticated</p>
              </div>
            </Link>

            <button
              onClick={() => logoutUser(navigate)}
              className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5"
              title="Secure Logout"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;