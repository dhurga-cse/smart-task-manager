import React from 'react';

const StatsCard = ({ icon: Icon, label, value, lightGradient, darkGradient, iconColor }) => (
  <div className="card card-hover group cursor-default animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm
                       group-hover:scale-110 transition-transform duration-200
                       ${lightGradient} dark:${darkGradient}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

export default StatsCard;
