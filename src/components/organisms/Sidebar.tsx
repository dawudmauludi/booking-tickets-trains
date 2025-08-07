import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="mb-4">Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/admin/dashboard">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/admin/trains">Trains</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/admin/stations">Stations</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/admin/routes">Routes</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/admin/schedules">Schedules</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/admin/transactions">Transactions</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
