import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/UseAuthStore";
import UserService from "../../services/UserServices";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { user, token, expires_at } = await UserService.login({ email, password });

      login(user, token, expires_at);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login gagal:", err);
      alert("Email atau password salah");
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md space-y-4">
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">Login</button>
      <span>
        Apakah Belum Memiliki Akun?{" "}
        <a href="/auth/registrasi" className="text-blue-600 underline">Registrasi</a>
      </span>
    </form>
  );
}
