import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Route {
  id: number;
}

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRouteId, setNewRouteId] = useState('');
  const [editRoute, setEditRoute] = useState<Route | null>(null);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      console.log('response.data:', response.data);
      setRoutes(response.data); // pastikan response.data adalah array
    } catch (error) {
      console.error('Failed to fetch routes', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/routes', { id: Number(newRouteId) });
      setShowModal(false);
      setNewRouteId('');
      fetchRoutes();
    } catch (error) {
      console.error('Failed to create route', error);
    }
  };

  const handleUpdate = async () => {
    if (!editRoute) return;
    try {
      await axios.put(`/api/routes/${editRoute.id}`, { id: Number(newRouteId) });
      setShowModal(false);
      setNewRouteId('');
      setEditRoute(null);
      fetchRoutes();
    } catch (error) {
      console.error('Failed to update route', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/routes/${id}`);
      fetchRoutes();
    } catch (error) {
      console.error('Failed to delete route', error);
    }
  };

  const openModalForCreate = () => {
    setEditRoute(null);
    setNewRouteId('');
    setShowModal(true);
  };

  const openModalForEdit = (route: Route) => {
    setEditRoute(route);
    setNewRouteId(route.id.toString());
    setShowModal(true);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Routes</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={openModalForCreate}
        >
          + Add Route
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(routes) && routes.map((route) => (
            <tr key={route.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{route.id}</td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => openModalForEdit(route)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editRoute ? 'Edit Route' : 'Add Route'}
            </h2>
            <input
              type="number"
              value={newRouteId}
              onChange={(e) => setNewRouteId(e.target.value)}
              placeholder="Enter ID"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditRoute(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={editRoute ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editRoute ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
