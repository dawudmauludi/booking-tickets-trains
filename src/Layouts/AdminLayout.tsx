import React from 'react';
import Sidebar from '../components/organisms/Sidebar';
import Topbar from '../components/organisms/Topbar';
import { Outlet } from 'react-router';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Topbar */}
        <div className="fixed top-0 right-0 left-64 z-20">
          <Topbar />
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 pt-16 p-6 overflow-auto bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
