// src/layouts/AppLayouts.tsx
import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/UseAuthStore";
import images from "../assets/ah 2.png";

export default function AppLayouts() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleHistory = () => {
    // Navigasi ke halaman History
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, #F3CE1E 0%, transparent 50%), 
                                radial-gradient(circle at 75% 75%, #F3CE1E 0%, transparent 50%)`
             }}>
        </div>
      </div>

      {/* Header */}
      <header className="relative">
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F3CE1E]/50 to-transparent"></div>
        
        <div className="relative px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-lg">
                <img src={images} alt="" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Booking Kereta
                </h1>
                <p className="text-xs text-gray-400">Perjalanan Terpercaya</p>
              </div>
            </div>

            {/* Navigation & User Menu */}
            {user && (
              <div className="flex items-center gap-6">
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1">
                  <button 
                    onClick={() => navigate("/")}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 
                             rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Beranda
                  </button>
                  
                  <button 
                    onClick={handleHistory}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 
                             rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                  </button>
                </nav>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-4">
                  {/* User Profile */}
                  <div className="hidden sm:flex items-center gap-3 bg-gray-800/30 rounded-xl px-4 py-2 border border-gray-700/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#F3CE1E]/20 to-[#F3CE1E]/10 rounded-full 
                                  flex items-center justify-center border border-[#F3CE1E]/20">
                      <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">Pengguna</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500/10 to-red-600/10 
                             hover:from-red-500/20 hover:to-red-600/20
                             text-red-400 hover:text-red-300 
                             border border-red-500/20 hover:border-red-400/30
                             px-4 py-2 rounded-xl transition-all duration-200 
                             flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="min-h-[calc(100vh-80px)]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F3CE1E]/50 to-transparent"></div>
        
        <div className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Brand Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* <div className="w-8 h-8 bg-gradient-to-br from-[#F3CE1E] to-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div> */}

                  <img src={images} alt="" className="w-12 rounded-full" />

                  <span className="text-lg font-bold text-white">UTrains</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Platform terpercaya untuk pemesanan tiket kereta api di Indonesia. 
                  Nikmati perjalanan yang nyaman dan aman.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Navigasi Cepat</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => navigate("/")}
                    className="block text-gray-400 hover:text-[#F3CE1E] transition-colors text-sm"
                  >
                    Beranda
                  </button>
                  {user && (
                    <button 
                      onClick={handleHistory}
                      className="block text-gray-400 hover:text-[#F3CE1E] transition-colors text-sm"
                    >
                      Riwayat Pemesanan
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Hubungi Kami</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+62 800-123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>support@bookingkereta.id</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Booking Kereta. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Kebijakan Privasi</span>
                <span>•</span>
                <span>Syarat & Ketentuan</span>
                <span>•</span>
                <span>Bantuan</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}2