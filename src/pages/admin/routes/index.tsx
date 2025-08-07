import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaRoute, FaMapMarkerAlt, FaTrain } from 'react-icons/fa';
import api from "../../../api/api";
import Swal from "sweetalert2";

interface Station {
  id: string;
  name: string;
  code: string;
  latitude: string;
  longitude: string;
  city: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Route {
  id: string;
  origin_id: string;
  destination_id: string;
  origin: Station;
  destination: Station;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Route[];
    links: PaginationLink[];
  };
}

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [pagination, setPagination] = useState<PaginationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [stations, setStations] = useState<Station[]>([]);

  const fetchStations = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Station[] }>('/stations/all');
      console.log(response)
      if (Array.isArray(response.data.data)) {
        setStations(response.data.data);
      } else {
        setStations([]);
        console.error('Stations data is not an array:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      setStations([]);
    }
  };

  const [formData, setFormData] = useState({
    origin_id: '',
    destination_id: ''
  });

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      setFormData({
        origin_id: selectedRoute.origin_id,
        destination_id: selectedRoute.destination_id
      });
    } else {
      setFormData({
        origin_id: '',
        destination_id: ''
      });
    }
  }, [selectedRoute]);

  const fetchRoutes = async (url: string = '/routes') => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(url);
      setRoutes(response.data.data.data);
      setPagination(response.data.data.links);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        await api.post('/routes', formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Route has been created.',
          icon: 'success',
          confirmButtonColor: '#FBBF24'
        });
      } else {
        await api.put(`/routes/${selectedRoute?.id}`, formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Route has been updated.',
          icon: 'success',
          confirmButtonColor: '#FBBF24'
        });
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'An error occurred while processing your request.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FBBF24',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/routes/${id}`);
        await Swal.fire({
          title: 'Deleted!',
          text: 'Route has been deleted.',
          icon: 'success',
          confirmButtonColor: '#FBBF24'
        });
        fetchRoutes();
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete route.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  // Filter available destination stations based on selected origin
  const availableDestinations = Array.isArray(stations) ? stations.filter(station => station.id !== formData.origin_id) : [];
  
  // Filter available origin stations based on selected destination
  const availableOrigins = Array.isArray(stations) ? stations.filter(station => station.id !== formData.destination_id) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 rounded-lg shadow-lg" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <FaTrain className="text-yellow-400 text-5xl" />
            <h1 className="text-4xl font-bold text-yellow-400">Routes Management</h1>
          </div>
          <button
            onClick={() => {
              setFormMode('create');
              setSelectedRoute(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
          >
            <FaPlus />
            <span>Add New Route</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-yellow-400" />
                      <span>Origin</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-yellow-400" />
                      <span>Destination</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Distance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {routes.map((route) => {
                  const distance = calculateDistance(
                    parseFloat(route.origin.latitude),
                    parseFloat(route.origin.longitude),
                    parseFloat(route.destination.latitude),
                    parseFloat(route.destination.longitude)
                  );
                  
                  return (
                    <tr key={route.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{route.origin.city}</span>
                          <span className="text-gray-400 text-sm">{route.origin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{route.destination.city}</span>
                          <span className="text-gray-400 text-sm">{route.destination.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{distance} km</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              setSelectedRoute(route);
                              setFormMode('edit');
                              setIsModalOpen(true);
                            }}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors inline-flex items-center space-x-1"
                          >
                            <FaEdit />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(route.id)}
                            className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center space-x-1"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {pagination.map((link, index) => (
            <button
              key={index}
              onClick={() => link.url && fetchRoutes(link.url)}
              disabled={!link.url || link.active}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                link.active 
                  ? 'bg-yellow-500 text-gray-900'
                  : link.url 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-8 w-full max-w-lg shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">
                {formMode === 'create' ? 'Add New Route' : 'Edit Route'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Origin Station</label>
                <select
                  name="origin_id"
                  value={formData.origin_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  required
                >
                  <option value="" selected disabled>Select Origin Station</option>

                  {availableOrigins.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.city} - {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination Station</label>
                <select
                  name="destination_id"
                  value={formData.destination_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  required
                >
                  <option value="" selected disabled>Select Destination Station</option>

                  {availableDestinations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.city} - {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  {formMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
