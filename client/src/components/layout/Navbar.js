import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronDown, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16
                    bg-white dark:bg-slate-900
                    border-b border-slate-200 dark:border-slate-700
                    shadow-sm dark:shadow-slate-900/60
                    transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="btn-ghost lg:hidden">
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-white text-lg hidden sm:block tracking-tight">
              Smart Task Manager
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">

          {/* Dark / Light Toggle */}
          <button
            onClick={toggle}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative btn-ghost group overflow-hidden"
          >
            <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${dark ? 'bg-yellow-400/10' : 'bg-indigo-400/10'} opacity-0 group-hover:opacity-100`} />
            {dark
              ? <FiSun  className="w-5 h-5 text-yellow-400 relative z-10" />
              : <FiMoon className="w-5 h-5 text-indigo-500 relative z-10" />
            }
          </button>

          {/* Bell */}
          <button className="btn-ghost relative">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                         hover:bg-slate-100 dark:hover:bg-slate-700
                         transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">{initials}</span>
              </div>
              <span className="text-slate-700 dark:text-slate-200 text-sm font-medium hidden sm:block">{user?.name}</span>
              <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48
                              bg-white dark:bg-slate-800
                              rounded-xl shadow-xl
                              border border-slate-200 dark:border-slate-700
                              py-1 animate-fade-in z-50">
                <button
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5
                             text-slate-600 dark:text-slate-300
                             hover:text-slate-900 dark:hover:text-white
                             hover:bg-slate-50 dark:hover:bg-slate-700
                             transition-colors text-sm"
                >
                  <FiUser className="w-4 h-4" /> Profile
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5
                             text-red-500 hover:text-red-600
                             hover:bg-red-50 dark:hover:bg-red-500/10
                             transition-colors text-sm"
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
