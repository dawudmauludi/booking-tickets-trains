// src/pages/Unauthorized.tsx
import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4 text-red-600">403 - Unauthorized</h1>
      <p className="mb-4">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link to="/" className="text-blue-500 underline">Kembali ke Home</Link>
    </div>
  );
}
