import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaTrash, FaEdit, FaPlus, FaTrain, FaClock, FaRoute, FaMoneyBill, FaChair } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface Train {
  id: string;
  name: string;
  class: string;
  code: string;
  capacity: number;
}

interface Route {
  id: string;
  origin_id: string;
  destination_id: string;
  origin: {
    name: string;
    city: string;
  };
  destination: {
    name: string;
    city: string;
  };
}

interface Schedule {
  id: string;
  train_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  seat_available: number;
  train: {
    name: string;
    class: string;
    code: string;
    capacity: number;
  };
  route: {
    origin: {
      name: string;
    };
    destination: {
      name: string;
    };
  };
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
    data: Schedule[];
    links: PaginationLink[];
  };
}

interface FormData {
  train_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  price: number;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pagination, setPagination] = useState<PaginationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [trains, setTrains] = useState<Train[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [formData, setFormData] = useState<FormData>({
    train_id: "",
    route_id: "",
    departure_time: "",
    arrival_time: "",
    price: 0
  });

  const fetchTrains = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Train[] }>('/trains/allnopgnation');
      if (Array.isArray(response.data.data)) {
        setTrains(response.data.data);
      } else {
        setTrains([]);
        console.error('Trains data is not an array:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
      setTrains([]);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Route[] }>('/routes/all');
      if (Array.isArray(response.data.data)) {
        setRoutes(response.data.data);
      } else {
        setRoutes([]);
        console.error('Routes data is not an array:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTrains();
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedSchedule) {
      setFormData({
        train_id: selectedSchedule.train_id,
        route_id: selectedSchedule.route_id,
        departure_time: selectedSchedule.departure_time,
        arrival_time: selectedSchedule.arrival_time,
        price: parseFloat(selectedSchedule.price)
      });
    } else {
      setFormData({
        train_id: "",
        route_id: "",
        departure_time: "",
        arrival_time: "",
        price: 0
      });
    }
  }, [selectedSchedule]);

  const fetchSchedules = async (url: string = '/schedules/pagination') => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(url);
      setSchedules(response.data.data.data);
      setPagination(response.data.data.links);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        await api.post('/schedules', formData);
      } else {
        await api.put(`/schedules/${selectedSchedule?.id}`, formData);
      }
      setIsModalOpen(false);
      fetchSchedules();
      
      await Swal.fire({
        title: 'Success!',
        text: `Schedule successfully ${formMode === 'create' ? 'created' : 'updated'}`,
        icon: 'success',
        confirmButtonColor: '#EAB308'
      });
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: `Failed to ${formMode} schedule`,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EAB308',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/schedules/${id}`);
        await Swal.fire({
          title: 'Deleted!',
          text: 'Schedule has been deleted.',
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
        fetchSchedules();
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete schedule.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
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
          <h1 className="text-3xl font-bold text-yellow-400">Train Schedules Management</h1>
        </div>
        <button
          onClick={() => {
            setFormMode('create');
            setSelectedSchedule(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-colors flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Schedule</span>
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
                    <span>Train Name</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaRoute />
                    <span>Route</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span>Departure</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span>Arrival</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaMoneyBill />
                    <span>Price</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaChair />
                    <span>Available Seats</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{schedule.train.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{schedule.train.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="px-2 py-1 bg-gray-700 rounded-md">{schedule.train.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {schedule.route.origin.name} → {schedule.route.destination.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(schedule.departure_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(schedule.arrival_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {parseFloat(schedule.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {schedule.seat_available}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setFormMode('edit');
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors inline-flex items-center space-x-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-400">
                {formMode === 'create' ? 'Add New Schedule' : 'Edit Schedule'}
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
                  <label className="block text-gray-300 mb-2">Train</label>
                  <select
                    name="train_id"
                    value={formData.train_id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  >
                    <option value="" disabled>Select Train</option>
                    {trains.map(train => (
                      <option key={train.id} value={train.id}>
                        {train.name} - {train.class} ({train.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Route</label>
                  <select
                    name="route_id"
                    value={formData.route_id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  >
                    <option value="" disabled>Select Route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.origin.city} ({route.origin.name}) → {route.destination.city} ({route.destination.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Departure Time</label>
                  <input
                    type="datetime-local"
                    name="departure_time"
                    value={formData.departure_time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Arrival Time</label>
                  <input
                    type="datetime-local"
                    name="arrival_time"
                    value={formData.arrival_time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Price (IDR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    required
                  />
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
