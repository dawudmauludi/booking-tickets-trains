import React from 'react';
import Sidebar from '../components/organisms/Sidebar';
import Topbar from '../components/organisms/Topbar';
import { Outlet } from 'react-router';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
