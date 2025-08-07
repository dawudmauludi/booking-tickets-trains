import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ScheduleService } from "../services/ScheduleService";
import type { SearchFormData } from "../Validations/SearchFormData";
import { useAuthStore } from "../store/UseAuthStore";
import type { Schedule } from "../models/Schedule";
import SearchForm from "../components/organisms/SearchForm";

export function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchData, setSearchData] = useState<SearchFormData | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSearch = async (data: SearchFormData) => {
    setSearchData(data);
    try {
      const response = await ScheduleService.search(data);

      // Jika paginated, ambil hanya `data.data`
      const results = response.data || response; // fallback kalau tidak paginated
      setSchedules(results);
    } catch (error) {
      alert("Jadwal Kereta Tidak ada");
      console.error(error);
    }
  };

  const handleBooking = (schedule: Schedule) => {
    navigate(`/booking/${schedule.id}`, {
      state: { schedule, searchData },
    });
  };

  useEffect(() => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mencari tiket.");
      navigate("/auth/login");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 80%, #F3CE1E 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, #F3CE1E 0%, transparent 50%), 
                                radial-gradient(circle at 40% 40%, #F3CE1E 0%, transparent 50%)`
             }}>
        </div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-[#F3CE1E] bg-clip-text text-transparent">
            Cari Tiket Kereta
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#F3CE1E] to-transparent mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 text-lg">
            Temukan perjalanan kereta terbaik untuk destinasi impian Anda
          </p>
        </div>

        {/* Search Form Container */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 shadow-2xl mb-8">
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        {schedules.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-[#F3CE1E] to-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Hasil Pencarian</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#F3CE1E] to-transparent"></div>
            </div>
            
            <div className="space-y-6">
              {schedules.map((s) => (
                <div key={s.id} 
                     className="group relative bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80 
                              backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 
                              hover:border-[#F3CE1E]/30 transition-all duration-300 
                              shadow-xl hover:shadow-2xl hover:shadow-[#F3CE1E]/10">
                  
                  {/* Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F3CE1E] to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Train Info */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#F3CE1E]/20 to-[#F3CE1E]/10 
                                      rounded-xl flex items-center justify-center border border-[#F3CE1E]/20">
                          <svg className="w-6 h-6 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#F3CE1E] transition-colors duration-300">
                            {s.train?.name}
                          </h3>
                          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium text-[#F3CE1E] 
                                         bg-[#F3CE1E]/10 rounded-full border border-[#F3CE1E]/20">
                            {s.train?.class}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#F3CE1E] rounded-full"></div>
                          <span className="font-medium text-white">{s.route?.origin?.name}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="h-px bg-gradient-to-r from-[#F3CE1E] via-gray-600 to-[#F3CE1E] w-full"></div>
                          <div className="mx-3 p-2 bg-[#F3CE1E]/10 rounded-full border border-[#F3CE1E]/20">
                            <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                          <div className="h-px bg-gradient-to-r from-[#F3CE1E] via-gray-600 to-[#F3CE1E] w-full"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{s.route?.destination?.name}</span>
                          <div className="w-3 h-3 bg-[#F3CE1E] rounded-full"></div>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-800/20 rounded-lg border border-gray-700/50">
                          <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Keberangkatan</div>
                            <div className="font-semibold text-white">
                              {new Date(s.departure_time).toLocaleString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-800/20 rounded-lg border border-gray-700/50">
                          <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Kedatangan</div>
                            <div className="font-semibold text-white">
                              {new Date(s.arrival_time).toLocaleString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Booking */}
                    <div className="flex flex-col justify-between">
                      <div className="text-center md:text-right space-y-3">
                        <div className="space-y-1">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[#F3CE1E] to-yellow-400 bg-clip-text text-transparent">
                            Rp {parseInt(s.price.toString()).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">per penumpang</div>
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-end gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm">
                            {s.seat_available} kursi tersedia
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate(`/booking/${s.id}`, {
                            state: {
                              schedule: s,
                              searchData,
                            },
                          });
                        }}
                        className="w-full mt-6 bg-gradient-to-r from-[#F3CE1E] to-yellow-500 
                                 hover:from-yellow-500 hover:to-[#F3CE1E] 
                                 text-black font-semibold py-4 px-6 rounded-xl 
                                 transition-all duration-300 
                                 shadow-lg hover:shadow-xl hover:shadow-[#F3CE1E]/25 
                                 transform hover:scale-105 
                                 flex items-center justify-center gap-2
                                 group-hover:animate-pulse"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Pesan Tiket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchData && schedules.length === 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 
                          backdrop-blur-sm rounded-3xl p-12 
                          border border-gray-800/50 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-600/5 
                            rounded-full flex items-center justify-center mx-auto mb-6
                            border border-red-500/20">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Tidak Ada Jadwal Tersedia
              </h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                Maaf, tidak ada jadwal kereta yang tersedia untuk pencarian Anda. 
                Silakan coba dengan tanggal atau rute yang berbeda.
              </p>
              <div className="mt-6 w-32 h-1 bg-gradient-to-r from-transparent via-red-400/30 to-transparent mx-auto rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}