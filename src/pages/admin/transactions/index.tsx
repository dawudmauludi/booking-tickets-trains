import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaTrainSubway, FaLocationDot, FaUsers, FaMoneyBill, FaClock, FaCalendarDays } from "react-icons/fa6";

interface Train {
    id: string;
    name: string;
    class: string;
    code: string;
    capacity: number;
}

interface Station {
    id: string;
    name: string;
    code: string;
    city: string;
}

interface Route {
    id: string;
    origin: Station;
    destination: Station;
}

interface Schedule {
    id: string;
    train: Train;
    route: Route;
    departure_time: string;
    arrival_time: string;
    price: string;
    seat_available: number;
}

interface Passenger {
    id: string;
    booking_id: string;
    name: string;
    id_number: string;
    seat_number: number;
    status: string;
}

interface Payment {
    id: string;
    amount: string;
    status: string;
    payment_url: string;
    payment_type: string;
}

interface Transaction {
    id: string;
    total_price: string;
    status: 'pending' | 'paid' | 'failed';
    reason_canceled: string | null;
    created_at: string;
    schedule: Schedule;
    passengers: Passenger[];
    payment: Payment | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface TransactionResponse {
    current_page: number;
    data: Transaction[];
    links: PaginationLink[];
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: TransactionResponse;
}

export default function TransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);    
    const [pagination, setPagination] = useState<PaginationLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedPassengers, setSelectedPassengers] = useState<Passenger[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get<ApiResponse>('/bookings');
                const data = response.data;
                setPagination(data.data.links);
                setTransactions(data.data.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    const handlePageChange = async (url: string | null) => {
        if (!url) return;
        
        setLoading(true);
        try {
            const response = await api.get<ApiResponse>(url);
            const data = response.data;
            setPagination(data.data.links);
            setTransactions(data.data.data);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    const openPassengerModal = (passengers: Passenger[]) => {
        setSelectedPassengers(passengers);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error!</strong>
                    <span className="block">{error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-yellow-400">Transaction List</h1>
            
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-600">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Train Details</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Passengers</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-600">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <FaTrainSubway className="text-yellow-400" />
                                            <div>
                                                <div className="font-medium text-white">{transaction.schedule.train.name}</div>
                                                <div className="text-sm text-gray-300">{transaction.schedule.train.code} ({transaction.schedule.train.class})</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-3 p-3 bg-gray-750 rounded-lg border border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1.5 bg-green-400/10 rounded-full">
                                                        <FaLocationDot className="text-green-400 w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-200">{transaction.schedule.route.origin.city}</span>
                                                </div>
                                                <div className="h-px w-8 bg-gradient-to-r from-green-400 to-red-400"></div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1.5 bg-red-400/10 rounded-full">
                                                        <FaLocationDot className="text-red-400 w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-200">{transaction.schedule.route.destination.city}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-gray-600/50">
                                                <div className="flex items-center gap-6 w-full">
                                                    <div className="flex items-center space-x-3 bg-gray-700/50 px-4 py-2 rounded-lg flex-1">
                                                        <div className="p-2 bg-green-400/20 rounded-full">
                                                            <FaCalendarDays className="text-green-400 w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-green-400">Departure</span>
                                                            <span className="text-sm font-bold text-gray-200">
                                                                {new Date(transaction.schedule.departure_time).toLocaleDateString('en-US', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-200">
                                                                {new Date(transaction.schedule.departure_time).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3 bg-gray-700/50 px-4 py-2 rounded-lg flex-1">
                                                        <div className="p-2 bg-red-400/20 rounded-full">
                                                            <FaCalendarDays className="text-red-400 w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-red-400">Arrival</span>
                                                            <span className="text-sm font-bold text-gray-200">
                                                                {new Date(transaction.schedule.arrival_time).toLocaleDateString('en-US', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-200">
                                                                {new Date(transaction.schedule.arrival_time).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => openPassengerModal(transaction.passengers)}
                                            className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
                                        >
                                            <FaUsers />
                                            <span>{transaction.passengers.length} Passengers</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <FaMoneyBill className="text-yellow-400" />
                                            <span className="text-gray-300">Rp {parseInt(transaction.total_price).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            transaction.status === 'paid' 
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-yellow-400">Passenger Details</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-300 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {selectedPassengers.map((passenger) => (
                                    <tr key={passenger.id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{passenger.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{passenger.id_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{passenger.seat_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500 text-gray-900">
                                                {passenger.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-6 gap-2">
                {pagination.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(link.url)}
                        disabled={!link.url || link.active}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                            link.active 
                                ? 'bg-yellow-500 text-gray-900'
                                : link.url 
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                    </button>
                ))}
            </div>
        </div>
    );
}