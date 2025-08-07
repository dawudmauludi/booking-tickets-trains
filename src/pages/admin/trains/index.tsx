import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
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

  const fetchTrains = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/trains?pagination=true&page=${currentPage}`
      );
      const trainsData = res.data?.data?.data?.data ?? [];
      const lastPage = res.data?.data?.data?.last_page ?? 1;
      setTrains(trainsData);
      setTotalPages(lastPage);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengambil data kereta.", "error");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [currentPage]);

  const openAddModal = () => {
    setForm({ name: "", class: "", code: "", capacity: 0 });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (train: Train) => {
    setCurrentTrain(train);
    setForm(train);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/trains/${id}`);
        await fetchTrains();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menghapus data.", "error");
        console.error("Delete error:", err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && currentTrain) {
        await axios.put(
          `http://localhost:8000/api/trains/${currentTrain.id}`,
          form
        );
        Swal.fire("Berhasil!", "Data kereta berhasil diperbarui.", "success");
      } else {
        await axios.post(`http://localhost:8000/api/trains`, form);
        Swal.fire("Berhasil!", "Data kereta berhasil ditambahkan.", "success");
      }
      setModalOpen(false);
      fetchTrains();
    } catch (err) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen max-w-6xl mx-auto font-sans text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold select-none">
          Manajemen Kereta
        </h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#F3CE1E] text-black font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          aria-label="Tambah Kereta"
        >
          <Plus size={24} />
          Tambah Kereta
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#F3CE1E] text-black uppercase tracking-wider text-xs font-semibold select-none">
            <tr>
              <th className="px-6 py-4 text-left">Nama</th>
              <th className="px-6 py-4 text-left">Kelas</th>
              <th className="px-6 py-4 text-left">Kode</th>
              <th className="px-6 py-4 text-left">Kapasitas</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trains.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-400 italic"
                >
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              trains.map((train, i) => (
                <tr
                  key={train.id}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-[#fffdea]" : "bg-white"
                  } hover:bg-yellow-100`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {train.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-700">
                    {train.class}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{train.code}</td>
                  <td className="px-6 py-4 text-gray-700">{train.capacity}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(train)}
                      className="p-2 rounded-full bg-yellow-200 hover:bg-yellow-300 text-black transition"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(train.id)}
                      className="p-2 rounded-full bg-red-200 hover:bg-red-300 text-black transition"
                      title="Hapus"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center gap-3 select-none">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-full font-semibold text-base border-2 border-black transition-all duration-300 ${
              currentPage === i + 1
                ? "bg-[#F3CE1E] text-black shadow-md"
                : "bg-white text-black hover:bg-yellow-300"
            }`}
            aria-label={`Halaman ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">
            <h2 className="text-2xl font-bold mb-7 select-none">
              {isEdit ? "Edit Kereta" : "Tambah Kereta"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-5"
            >
              <input
                type="text"
                placeholder="Nama"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-[#F3CE1E] transition"
                required
                autoFocus
              />
              <select
                value={form.class}
                onChange={(e) => setForm({ ...form, class: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-[#F3CE1E] transition"
                required
              >
                <option value="" disabled>
                  Pilih Kelas
                </option>
                <option value="economy">Ekonomi</option>
                <option value="business">Bisnis</option>
                <option value="executive">Eksekutif</option>
                <option value="non-economy">Non Ekonomi</option>
              </select>

              <input
                type="text"
                placeholder="Kode"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-[#F3CE1E] transition"
                required
              />
              <input
                type="number"
                placeholder="Kapasitas"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-[#F3CE1E] transition"
                min={0}
                required
              />

              <div className="flex justify-end gap-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-lg border border-black font-semibold hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#F3CE1E] font-bold text-black hover:bg-yellow-400 transition"
                >
                  Simpan
                </button>
              </div>
            </form>

            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-black hover:text-yellow-600 transition text-3xl font-bold select-none"
              type="button"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
}
