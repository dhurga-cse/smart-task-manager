import React, { useState } from 'react';
import { FiBell, FiMoon, FiSun, FiGlobe, FiShield, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout';

const ToggleSwitch = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                ${checked ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                      transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

const Settings = () => {
  const { dark, toggle } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    overdueAlerts: true,
    twoFactor: false,
    language: 'en',
  });

  const setToggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  const sections = [
    {
      title: 'Notifications', icon: FiBell,
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get notified via email about task updates' },
        { key: 'pushNotifications',  label: 'Push Notifications',  desc: 'Receive push notifications in browser'   },
        { key: 'overdueAlerts',      label: 'Overdue Alerts',      desc: 'Get alerts when tasks pass due date'     },
      ],
    },
    {
      title: 'Security', icon: FiShield,
      items: [
        { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add extra security to your account' },
      ],
    },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your application preferences</p>
        </div>

        {/* Appearance Card — Dark Mode Toggle */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            {dark ? <FiMoon className="w-4 h-4 text-blue-400" /> : <FiSun className="w-4 h-4 text-yellow-500" />}
            Appearance
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">Dark Mode</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                {dark ? 'Currently using dark theme' : 'Currently using light theme'}
              </p>
            </div>
            <ToggleSwitch checked={dark} onChange={toggle} />
          </div>
          {/* Visual preview pill */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                          ${dark
                            ? 'bg-slate-700 border-slate-600 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            {dark
              ? <><FiMoon className="w-4 h-4 text-blue-400" /><span className="text-sm font-medium">Dark theme active</span></>
              : <><FiSun  className="w-4 h-4 text-yellow-500" /><span className="text-sm font-medium">Light theme active</span></>
            }
          </div>
        </div>

        {/* Other sections */}
        {sections.map(({ title, icon: Icon, items }) => (
          <div key={title} className="card space-y-4">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" /> {title}
            </h2>
            {items.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{label}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{desc}</p>
                </div>
                <ToggleSwitch checked={settings[key]} onChange={() => setToggle(key)} />
              </div>
            ))}
          </div>
        ))}

        {/* Language */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-4">
            <FiGlobe className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Language
          </h2>
          <select className="input-field" value={settings.language}
            onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))}>
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
          </select>
        </div>

        <button onClick={() => toast.success('Settings saved!')} className="btn-primary flex items-center gap-2">
          <FiCheck className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </Layout>
  );
};

export default Settings;
