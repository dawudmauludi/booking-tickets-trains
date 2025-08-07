import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen w-64 p-4 text-gray-100 shadow-xl">
      <div className="flex items-center mb-8 px-4">
        <div className="bg-indigo-600 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-white">Admin Panel</h4>
      </div>
      <ul className="space-y-1">
        <li>
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/trains"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12l4 5H8V7zM8 7V6a1 1 0 011-1h4a1 1 0 011 1v1M8 7v5m0 0v3a2 2 0 002 2h8a2 2 0 002-2v-3M8 12h12" />
            </svg>
            Trains
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/stations"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Stations
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/routes"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Routes
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/schedules"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedules
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/transactions"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Transactions
          </NavLink>
        </li>
      </ul>
      
      {/* Logout Section */}
      <div className="mt-auto pt-4 border-t border-slate-700">
        <button className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-red-600 hover:text-white group">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
