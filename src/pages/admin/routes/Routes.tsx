import React from 'react';

const RoutesPage: React.FC = () => {
  const routes = [
    { id: 1, from: 'Jakarta', to: 'Bandung', duration: '3 jam' },
    { id: 2, from: 'Surabaya', to: 'Malang', duration: '2 jam' },
    { id: 3, from: 'Yogyakarta', to: 'Semarang', duration: '4 jam' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Rute</h1>
        <p className="text-gray-500 mt-1">Kelola rute perjalanan kereta api</p>
      </div>

      <div className="mb-4 flex justify-end">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Tambah Rute
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Asal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tujuan</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Durasi</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {routes.map((route, index) => (
              <tr key={route.id}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{route.from}</td>
                <td className="px-6 py-4">{route.to}</td>
                <td className="px-6 py-4">{route.duration}</td>
                <td className="px-6 py-4 space-x-2">
                  <button className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutesPage;
