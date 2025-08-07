import React from 'react';

const Topbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            {/* <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
              />
            </div> */}
            
            {/* Notifications */}
            {/* <button className="relative p-2 text-gray-300 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7 7l3.12 3.12M3 3l18 18" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-gray-800"></span>
            </button> */}
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white">Admin User</div>
                <div className="text-xs text-gray-300">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
