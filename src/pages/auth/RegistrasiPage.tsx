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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setAuth = useAuthStore((state) => state.login); // ⬅️ gunakan login method dari zustand
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.name || !form.email || !form.password) {
      setIsLoading(false);
      return alert("Semua field wajib diisi");
    }

    if (form.password !== form.password_confirmation) {
      setIsLoading(false);
      return alert("Konfirmasi password tidak cocok");
    }

    try {
      const res = await UserService.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "customer", 
      });

      const { user, token, expires_at } = res;

      setAuth(user, token, expires_at); 
      localStorage.setItem("token", token);

      navigate("/auth/login")

    } catch (err: any) {
      console.error("Gagal registrasi:", err);
      alert("Gagal registrasi. Cek kembali inputan atau email sudah digunakan.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 25, label: "Lemah", color: "bg-red-500" };
    if (password.length < 8) return { strength: 50, label: "Sedang", color: "bg-yellow-500" };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 100, label: "Kuat", color: "bg-green-500" };
    }
    return { strength: 75, label: "Baik", color: "bg-blue-500" };
  };

  const passwordStrength = getPasswordStrength(form.password);
  const passwordsMatch = form.password === form.password_confirmation && form.password_confirmation !== "";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #F3CE1E15 0%, transparent 50%), 
                         radial-gradient(circle at 80% 20%, #F3CE1E10 0%, transparent 50%),
                         radial-gradient(circle at 40% 80%, #F3CE1E08 0%, transparent 50%)`
      }}></div>

      <div className="relative w-full max-w-md">
        {/* Registration Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#F3CE1E] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-black">✨</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F3CE1E] to-yellow-300 bg-clip-text text-transparent mb-2">
              Bergabung Dengan Kami
            </h2>
            <p className="text-gray-400">Buat akun baru untuk mulai perjalanan Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-4 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E] focus:ring-opacity-20 transition-all duration-300 pl-12"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-[#F3CE1E]">👤</span>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Masukkan email Anda"
                  className="w-full px-4 py-4 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E] focus:ring-opacity-20 transition-all duration-300 pl-12"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-[#F3CE1E]">📧</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Buat password yang kuat"
                  className="w-full px-4 py-4 bg-black border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E] focus:ring-opacity-20 transition-all duration-300 pl-12 pr-12"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-[#F3CE1E]">🔒</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#F3CE1E] transition-colors"
                >
                  <span>{showPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Kekuatan Password</span>
                    <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-400' : passwordStrength.strength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Konfirmasi Password</label>
              <div className="relative">
                <input
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Ulangi password Anda"
                  className={`w-full px-4 py-4 bg-black border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 transition-all duration-300 pl-12 pr-12 ${
                    form.password_confirmation === "" 
                      ? "border-gray-600 focus:border-[#F3CE1E] focus:ring-[#F3CE1E]"
                      : passwordsMatch 
                        ? "border-green-500 focus:border-green-400 focus:ring-green-400" 
                        : "border-red-500 focus:border-red-400 focus:ring-red-400"
                  }`}
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-[#F3CE1E]">🔐</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-12 flex items-center pr-4 text-gray-400 hover:text-[#F3CE1E] transition-colors"
                >
                  <span>{showConfirmPassword ? "🙈" : "👁️"}</span>
                </button>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  {form.password_confirmation !== "" && (
                    <span className={passwordsMatch ? "text-green-400" : "text-red-400"}>
                      {passwordsMatch ? "✅" : "❌"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#F3CE1E] to-yellow-400 hover:from-yellow-400 hover:to-[#F3CE1E] disabled:from-gray-600 disabled:to-gray-500 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-[#F3CE1E]/50 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sedang Mendaftar...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Daftar Sekarang
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <div className="px-4 text-gray-400 text-sm">atau</div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">Sudah memiliki akun?</p>
            <a 
              href="/auth/login" 
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-transparent border-2 border-gray-600 hover:border-[#F3CE1E] text-gray-300 hover:text-[#F3CE1E] font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] group"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform">🔑</span>
              Masuk ke Akun
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Dengan mendaftar, Anda menyetujui 
              <a href="#" className="text-[#F3CE1E] hover:underline ml-1">Syarat & Ketentuan</a> dan
              <a href="#" className="text-[#F3CE1E] hover:underline ml-1">Kebijakan Privasi</a> kami
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#F3CE1E] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 -left-8 w-6 h-6 bg-[#F3CE1E] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 -right-10 w-4 h-4 bg-yellow-300 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  );
}