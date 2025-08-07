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
import { FaTrainSubway, FaBookmark, FaCalendarDays } from 'react-icons/fa6';
import { FaBuilding } from 'react-icons/fa';

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

export const Dashboard = () => {
    // Generate random monthly data
    const [monthlyProfitData, setMonthlyProfitData] = useState({
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
            label: 'Monthly Profit',
            data: [
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000)
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    });

    // Generate random daily data
    const [dailyProfitData, setDailyProfitData] = useState({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Daily Profit',
            data: [
                Math.floor(Math.random() * 100000000),
                Math.floor(Math.random() * 100000000),
                Math.floor(Math.random() * 100000000),
                Math.floor(Math.random() * 100000000),
                Math.floor(Math.random() * 100000000),
                Math.floor(Math.random() * 100000000),
                Math.floor(Math.random() * 100000000)
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    });

    useEffect(() => {
        // Generate new random data every 5 seconds
        const interval = setInterval(() => {
            setMonthlyProfitData(prev => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: prev.labels.map(() => Math.floor(Math.random() * 1000000000))
                }]
            }));

            setDailyProfitData(prev => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: prev.labels.map(() => Math.floor(Math.random() * 100000000))
                }]
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4 text-yellow-400">Admin Dashboard</h1>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Stations</h3>
                                <p className="text-2xl font-bold text-white">156</p>
                            </div>
                            <FaBuilding className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Bookings</h3>
                                <p className="text-2xl font-bold text-white">1,234</p>
                            </div>
                            <FaBookmark className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Trains</h3>
                                <p className="text-2xl font-bold text-white">42</p>
                            </div>
                            <FaTrainSubway className="text-3xl text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 text-sm">Active Schedules</h3>
                                <p className="text-2xl font-bold text-white">245</p>
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
                            <Line data={monthlyProfitData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-yellow-400">Daily Profit (Last 7 Days)</h2>
                        <div style={{ height: '400px' }}>
                            <Bar data={dailyProfitData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}