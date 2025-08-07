import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/UseAuthStore";
import UserService from "../../services/UserServices";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, token, expires_at } = await UserService.login({ email, password });

      login(user, token, expires_at);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login gagal:", err);
      alert("Email atau password salah");
    } finally {
      setIsLoading(false);
    }
  }

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
        {/* Login Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#F3CE1E] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-black">🚂</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F3CE1E] to-yellow-300 bg-clip-text text-transparent mb-2">
              Selamat Datang
            </h2>
            <p className="text-gray-400">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#F3CE1E] to-yellow-400 hover:from-yellow-400 hover:to-[#F3CE1E] disabled:from-gray-600 disabled:to-gray-500 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-[#F3CE1E]/50 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sedang Masuk...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Masuk
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

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">Belum memiliki akun?</p>
            <a 
              href="/auth/registrasi" 
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-transparent border-2 border-gray-600 hover:border-[#F3CE1E] text-gray-300 hover:text-[#F3CE1E] font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] group"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform">✨</span>
              Daftar Sekarang
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Dengan masuk, Anda menyetujui 
              <a href="#" className="text-[#F3CE1E] hover:underline ml-1">Syarat & Ketentuan</a> kami
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#F3CE1E] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -right-8 w-6 h-6 bg-[#F3CE1E] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}