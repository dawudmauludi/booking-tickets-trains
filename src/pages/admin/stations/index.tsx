import { useEffect, useState } from "react";
import type { Station } from "../../../models/Station";
import { FaTrash, FaEdit, FaPlus, FaTrain, FaMapMarkerAlt, FaCode, FaCity, FaClock } from 'react-icons/fa';
import api from "../../../api/api";
import Swal from 'sweetalert2';


interface StationData {
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

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: StationData[];
    links: PaginationLink[];
  };
}

interface FormData {
  name: string;
  code: string;
  city: string;
  latitude: string;
  longitude: string;
}

export default function StationPage() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [pagination, setPagination] = useState<PaginationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    city: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      setFormData({
        name: selectedStation.name,
        code: selectedStation.code,
        city: selectedStation.city,
        latitude: selectedStation.latitude,
        longitude: selectedStation.longitude
      });
    } else {
      setFormData({
        name: '',
        code: '',
        city: '',
        latitude: '',
        longitude: ''
      });
    }
  }, [selectedStation]);

  const fetchStations = async (url: string = '/stations') => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(url);
      setStations(response.data.data.data);
      setPagination(response.data.data.links);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        await api.post('/stations', formData);
      } else {
        await api.put(`/stations/${selectedStation?.id}`, formData);
      }
      setIsModalOpen(false);
      fetchStations();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    fetchStations(url);
  };

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EAB308', // Yellow-500 to match theme
    cancelButtonColor: '#EF4444', // Red-500
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/stations/${id}`);
      await Swal.fire({
        title: 'Deleted!',
        text: 'Station has been deleted.',
        icon: 'success',
        confirmButtonColor: '#EAB308'
      });
      fetchStations();
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete station.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      console.error('Error deleting station:', error);
    }
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <FaTrain className="text-yellow-400 text-4xl" />
          <h1 className="text-3xl font-bold text-yellow-400">Train Stations Management</h1>
        </div>
        <button
          onClick={() => {
            setFormMode('create');
            setSelectedStation(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-colors flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Station</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaTrain />
                    <span>Station Name</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaCode />
                    <span>Code</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaCity />
                    <span>City</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <span>Coordinates</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span>Last Updated</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{station.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="px-2 py-1 bg-gray-700 rounded-md">{station.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{station.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {station.latitude}, {station.longitude}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(station.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button
                      onClick={() => {
                        setSelectedStation(station);
                        setFormMode('edit');
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors inline-flex items-center space-x-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(station.id)}
                      className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center space-x-1"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {pagination.map((link, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(link.url)}
            disabled={!link.url || link.active}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
              link.active
                ? 'bg-yellow-500 text-gray-900'
                : link.url
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-400">
                {formMode === 'create' ? 'Add New Station' : 'Edit Station'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Station Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Station Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Latitude</label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Longitude</label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors"
                  >
                    {formMode === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}