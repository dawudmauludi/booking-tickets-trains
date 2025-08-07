import React, { useState } from "react";
import { useAuthStore } from "../../store/UseAuthStore";
import { useNavigate } from "react-router";
import UserService from "../../services/UserServices"; // ⬅️ penting

export default function Registrasi() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const setAuth = useAuthStore((state) => state.login); // ⬅️ gunakan login method dari zustand
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Semua field wajib diisi");
    }

    if (form.password !== form.password_confirmation) {
      return alert("Konfirmasi password tidak cocok");
    }

    try {
      const res = await UserService.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "customer", // bisa ubah jadi "admin" jika dibutuhkan
      });

      const { user, token, expires_at } = res;

      setAuth(user, token, expires_at); // simpan ke zustand
      localStorage.setItem("token", token);

      navigate("/auth/login")
      
    } catch (err: any) {
      console.error("Gagal registrasi:", err);
      alert("Gagal registrasi. Cek kembali inputan atau email sudah digunakan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nama"
        className="input"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="input"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="input"
      />
      <input
        name="password_confirmation"
        type="password"
        value={form.password_confirmation}
        onChange={handleChange}
        placeholder="Konfirmasi Password"
        className="input"
      />
      <button type="submit" className="btn w-full">
        Daftar
      </button>
    </form>
  );
}
