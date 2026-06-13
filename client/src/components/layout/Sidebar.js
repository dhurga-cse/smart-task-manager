import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiCheckSquare, FiUser, FiSettings } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: FiGrid,        label: 'Dashboard' },
  { to: '/tasks',     icon: FiCheckSquare, label: 'Tasks'     },
  { to: '/profile',   icon: FiUser,        label: 'Profile'   },
  { to: '/settings',  icon: FiSettings,    label: 'Settings'  },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && (
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
    )}
    <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-30 flex flex-col
                       bg-white dark:bg-slate-900
                       border-r border-slate-200 dark:border-slate-700
                       shadow-sm dark:shadow-slate-900/60
                       transition-all duration-300
                       ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 mb-3">
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

    </aside>
  </>
);

export default Sidebar;
