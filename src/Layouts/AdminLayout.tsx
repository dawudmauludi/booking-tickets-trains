import React from 'react';
import Sidebar from '../components/organisms/Sidebar';
import Topbar from '../components/organisms/Topbar';

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Topbar />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
