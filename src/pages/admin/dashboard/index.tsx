import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaTrainSubway, FaLocationDot, FaUsers, FaCalendarDays } from 'react-icons/fa6';
import api from '../../../api/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
    total_station: number;
    total_train: number;
    total_route: number;
    total_schedule: number;
    total_booking: number;
    profit_4_last_month: {
        [key: string]: string | number;
    };
    profit_7_last_week: {
        [key: string]: string | number;
    };
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: DashboardData;
}

export const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [monthlyProfitData, setMonthlyProfitData] = useState<any>(null);
    const [dailyProfitData, setDailyProfitData] = useState<any>(null);

    const fetchDashboard = async () => {
        console.log('🔄 Memulai pengambilan data dashboard...');
        try {
            console.log('📡 Mengirim request ke /dashboard/admin');
            const response = await api.get<ApiResponse>('/dashboard/admin');
            console.log('✅ Response diterima:', response.data);
            
            if (response.data.success) {
                console.log('✅ Data berhasil diambil:', response.data.data);
                setDashboardData(response.data.data);
                
                // Set monthly profit data
                const monthlyLabels = Object.keys(response.data.data.profit_4_last_month);
                const monthlyValues = Object.values(response.data.data.profit_4_last_month);
                setMonthlyProfitData({
                    labels: monthlyLabels,
                    datasets: [{
                        label: 'Monthly Profit',
                        data: monthlyValues,
                        backgroundColor: 'rgba(234, 179, 8, 0.2)',
                        borderColor: 'rgba(234, 179, 8, 1)',
                        borderWidth: 2
                    }]
                });
                
                // Set daily profit data
                const dailyLabels = Object.keys(response.data.data.profit_7_last_week);
                const dailyValues = Object.values(response.data.data.profit_7_last_week);
                setDailyProfitData({
                    labels: dailyLabels,
                    datasets: [{
                        label: 'Daily Profit',
                        data: dailyValues,
                        backgroundColor: 'rgba(234, 179, 8, 0.2)',
                        borderColor: 'rgba(234, 179, 8, 1)',
                        borderWidth: 2
                    }]
                });
            } else {
                console.error('❌ API mengembalikan error:', response.data.message);
                setError(new Error(response.data.message));
            }
        } catch (error: any) {
            console.error('❌ Error saat mengambil data:', error);
            setError(error);
        } finally {
            console.log('🏁 Proses pengambilan data selesai');
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('🚀 Komponen Dashboard dimount, memulai pengambilan data...');
        fetchDashboard();
        // Set up auto-refresh every 5 minutes
        console.log('⏰ Auto-refresh diatur setiap 5 menit');
        const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
        return () => {
            console.log('🧹 Membersihkan interval auto-refresh');
            clearInterval(interval);
        };
    }, []);

    // Manual refresh function with debounce to prevent rapid refreshes
    const [isRefreshing, setIsRefreshing] = useState(false);
    const handleRefresh = async () => {
        if (isRefreshing) {
            console.log('⚠️ Refresh sedang berlangsung, mengabaikan request baru');
            return;
        }
        console.log('🔄 Manual refresh dimulai...');
        setIsRefreshing(true);
        setLoading(true);
        await fetchDashboard();
        console.log('⏳ Cooldown 5 detik dimulai...');
        setTimeout(() => {
            console.log('✅ Cooldown selesai, refresh dapat dilakukan lagi');
            setIsRefreshing(false);
        }, 5000); // 5 second cooldown
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: { toLocaleString: () => any; }) => `Rp ${value.toLocaleString()}`
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block">{error.message}</span>
                    <button 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`mt-4 ${isRefreshing ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded`}
                    >
                        {isRefreshing ? 'Refreshing...' : 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">No data available</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h1>
                    <button 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`${isRefreshing ? 'bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-500'} text-gray-900 px-4 py-2 rounded transition-colors`}
                    >
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Stations</h3>
                                <p className="text-2xl font-bold text-white">{dashboardData.total_station}</p>
                            </div>
                            <FaLocationDot className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Bookings</h3>
                                <p className="text-2xl font-bold text-white">{dashboardData.total_booking}</p>
                            </div>
                            <FaUsers className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Trains</h3>
                                <p className="text-2xl font-bold text-white">{dashboardData.total_train}</p>
                            </div>
                            <FaTrainSubway className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Active Schedules</h3>
                                <p className="text-2xl font-bold text-white">{dashboardData.total_schedule}</p>
                            </div>
                            <FaCalendarDays className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-yellow-400">Monthly Profit (Last 4 Months)</h2>
                        <div style={{ height: '400px' }}>
                            {monthlyProfitData ? (
                                <Line data={monthlyProfitData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-yellow-400">Daily Profit (Last 7 Days)</h2>
                        <div style={{ height: '400px' }}>
                            {dailyProfitData ? (
                                <Bar data={dailyProfitData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}