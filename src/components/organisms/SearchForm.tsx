// src/components/organisms/SearchForm.tsx
import React, { useEffect, useState } from "react";
import type { SearchFormData } from "../../Validations/SearchFormData";
import { ScheduleService } from "../../services/ScheduleService";

type Props = {
  onSearch: (data: SearchFormData) => void;
};

export default function SearchForm({ onSearch }: Props) {
  const [form, setForm] = useState<SearchFormData>({
    origin: "",
    destination: "",
    date: "",
    adults: 1,
    infants: 0,
  });

  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      const data = await ScheduleService.getStations();
      setStations(data);
    };
    fetchStations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "adults" || name === "infants" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F3CE1E] to-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Pencarian Tiket Kereta</h3>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#F3CE1E] to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Route Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Origin Station */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              Stasiun Keberangkatan
            </label>
            <div className="relative">
              <select
                name="origin"
                value={form.origin}
                onChange={handleChange}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E]/20
                         transition-all duration-300 appearance-none cursor-pointer
                         hover:border-gray-500/70"
              >
                <option value="" className="bg-gray-800 text-gray-400">Pilih Stasiun Asal</option>
                {stations.map((station: any) => (
                  <option key={station.id} value={station.id} className="bg-gray-800 text-white">
                    {station.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Destination Station */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              Stasiun Tujuan
            </label>
            <div className="relative">
              <select
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E]/20
                         transition-all duration-300 appearance-none cursor-pointer
                         hover:border-gray-500/70"
              >
                <option value="" className="bg-gray-800 text-gray-400">Pilih Stasiun Tujuan</option>
                {stations.map((station: any) => (
                  <option key={station.id} value={station.id} className="bg-gray-800 text-white">
                    {station.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Route Connector Visual */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-green-500 via-[#F3CE1E] to-red-500 w-20"></div>
            <div className="p-1 bg-[#F3CE1E]/10 rounded-full border border-[#F3CE1E]/20">
              <svg className="w-3 h-3 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="h-px bg-gradient-to-r from-green-500 via-[#F3CE1E] to-red-500 w-20"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Date and Passengers */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tanggal Keberangkatan
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E]/20
                       transition-all duration-300 hover:border-gray-500/70
                       [color-scheme:dark]"
            />
          </div>

          {/* Adults */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Penumpang Dewasa
            </label>
            <div className="relative">
              <input
                type="number"
                name="adults"
                value={form.adults}
                onChange={handleChange}
                placeholder="Dewasa"
                min="1"
                max="10"
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E]/20
                         transition-all duration-300 hover:border-gray-500/70
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="absolute inset-y-0 right-0 flex flex-col">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                  className="flex-1 px-3 text-gray-400 hover:text-[#F3CE1E] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                  className="flex-1 px-3 text-gray-400 hover:text-[#F3CE1E] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Infants */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <svg className="w-4 h-4 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Bayi (0-2 tahun)
            </label>
            <div className="relative">
              <input
                type="number"
                name="infants"
                value={form.infants}
                onChange={handleChange}
                placeholder="Bayi"
                min="0"
                max="5"
                className="w-full bg-gray-800/60 border border-gray-600/50 rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-[#F3CE1E] focus:ring-2 focus:ring-[#F3CE1E]/20
                         transition-all duration-300 hover:border-gray-500/70
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="absolute inset-y-0 right-0 flex flex-col">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, infants: Math.min(5, prev.infants + 1) }))}
                  className="flex-1 px-3 text-gray-400 hover:text-[#F3CE1E] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))}
                  className="flex-1 px-3 text-gray-400 hover:text-[#F3CE1E] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers Summary */}
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#F3CE1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-300 font-medium">Total Penumpang</span>
            </div>
            <div className="text-white font-bold text-lg">
              {form.adults + form.infants} orang
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-sm text-gray-400">
            <span>{form.adults} dewasa</span>
            <span>•</span>
            <span>{form.infants} bayi</span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#F3CE1E] to-yellow-500 
                   hover:from-yellow-500 hover:to-[#F3CE1E] 
                   text-black font-bold py-4 px-8 rounded-xl
                   transition-all duration-300 
                   shadow-lg hover:shadow-xl hover:shadow-[#F3CE1E]/25
                   transform hover:scale-[1.02] active:scale-[0.98]
                   flex items-center justify-center gap-3
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   group"
        >
          <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-lg">Cari Tiket Kereta</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}