import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaTrain } from 'react-icons/fa';
import api from "../../../api/api";
import Swal from "sweetalert2";

type Train = {
  id: string;
  name: string;
  class: string;
  code: string;
  capacity: number;
};

export default function TrainsPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTrain, setCurrentTrain] = useState<Train | null>(null);
  const [form, setForm] = useState({
    name: "",
    class: "",
    code: "",
    capacity: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/trains?pagination=true&page=${currentPage}`
      );
      const trainsData = res.data?.data?.data?.data ?? [];
      const lastPage = res.data?.data?.data?.last_page ?? 1;
      setTrains(trainsData);
      setTotalPages(lastPage);
    } catch (error) {
      setError(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch trains data.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrains();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBBF24",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/trains/${id}`);
        await Swal.fire({
          title: "Deleted!",
          text: "Train has been deleted.",
          icon: "success",
          confirmButtonColor: "#FBBF24"
        });
        fetchTrains();
      } catch (err) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete train.",
          icon: "error",
          confirmButtonColor: "#EF4444"
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && currentTrain) {
        await api.put(`/trains/${currentTrain.id}`, form);
        await Swal.fire({
          title: "Success!",
          text: "Train has been updated.",
          icon: "success",
          confirmButtonColor: "#FBBF24"
        });
      } else {
        await api.post("/trains", form);
        await Swal.fire({
          title: "Success!",
          text: "Train has been created.",
          icon: "success",
          confirmButtonColor: "#FBBF24"
        });
      }
      setModalOpen(false);
      fetchTrains();
    } catch (err) {
      await Swal.fire({
        title: "Error!",
        text: "An error occurred while saving data.",
        icon: "error",
        confirmButtonColor: "#EF4444"
      });
    }
  };

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
            <h1 className="text-4xl font-bold text-yellow-400">Trains Management</h1>
          </div>
          <button
            onClick={() => {
              setForm({ name: "", class: "", code: "", capacity: 0 });
              setIsEdit(false);
              setModalOpen(true);
            }}
            className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
          >
            <FaPlus />
            <span>Add New Train</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Capacity</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {trains.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 italic">
                    No data available.
                  </td>
                </tr>
              ) : (
                trains.map((train) => (
                  <tr key={train.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-white">{train.name}</td>
                    <td className="px-6 py-4 text-gray-300 capitalize">{train.class}</td>
                    <td className="px-6 py-4 text-gray-300">{train.code}</td>
                    <td className="px-6 py-4 text-gray-300">{train.capacity}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            setCurrentTrain(train);
                            setForm(train);
                            setIsEdit(true);
                            setModalOpen(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors inline-flex items-center space-x-1"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(train.id)}
                          className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center space-x-1"
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                currentPage === i + 1
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-8 w-full max-w-lg shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">
                {isEdit ? "Edit Train" : "Add New Train"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                <select
                  value={form.class}
                  onChange={(e) => setForm({ ...form, class: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  required
                >
                  <option value="" disabled>Select Class</option>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="executive">Executive</option>
                  <option value="non-economy">Non-Economy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                  min={0}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
