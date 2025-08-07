import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import Swal from "sweetalert2";

interface Route {
  id: string;
  origin_id: string;
  destination_id: string;
}

const RoutesPage = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [form, setForm] = useState({ origin_id: "", destination_id: "" });

  const fetchRoutes = async () => {
    try {
      const res = await api.get("/routes");
      setRoutes(res.data.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post("/routes", form);
      setForm({ origin_id: "", destination_id: "" });
      setShowModal(false);
      Swal.fire("Sukses", "Rute berhasil ditambahkan", "success");
      fetchRoutes();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menambahkan rute", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Hapus Rute?",
      text: "Tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/routes/${id}`);
        Swal.fire("Dihapus", "Rute berhasil dihapus", "success");
        fetchRoutes();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", "error");
      }
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setForm({ origin_id: route.origin_id, destination_id: route.destination_id });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      if (!editingRoute) return;
      await api.put(`/routes/${editingRoute.id}`, form);
      Swal.fire("Sukses", "Rute berhasil diperbarui", "success");
      setEditingRoute(null);
      setForm({ origin_id: "", destination_id: "" });
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">Daftar Rute</h1>

      <button
        onClick={() => {
          setEditingRoute(null);
          setForm({ origin_id: "", destination_id: "" });
          setShowModal(true);
        }}
        className="mb-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded"
      >
        Tambah Rute
      </button>

      <table className="w-full table-auto border border-gray-700 text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Origin ID</th>
            <th className="border px-4 py-2">Destination ID</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className="bg-gray-900">
              <td className="border px-4 py-2">{route.id}</td>
              <td className="border px-4 py-2">{route.origin_id}</td>
              <td className="border px-4 py-2">{route.destination_id}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(route)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingRoute ? "Edit Rute" : "Tambah Rute"}
            </h2>
            <input
              type="text"
              placeholder="Origin ID"
              value={form.origin_id}
              onChange={(e) => setForm({ ...form, origin_id: e.target.value })}
              className="w-full px-3 py-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Destination ID"
              value={form.destination_id}
              onChange={(e) =>
                setForm({ ...form, destination_id: e.target.value })
              }
              className="w-full px-3 py-2 mb-4 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={editingRoute ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-yellow-400 text-black rounded"
              >
                {editingRoute ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
