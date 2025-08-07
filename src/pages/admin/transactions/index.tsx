import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaTrainSubway, FaLocationDot, FaUsers, FaMoneyBill, FaClock } from "react-icons/fa6";

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
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction List</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train Details</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <FaTrainSubway className="text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-900">{transaction.schedule.train.name}</div>
                                                <div className="text-sm text-gray-500">{transaction.schedule.train.code} ({transaction.schedule.train.class})</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <FaLocationDot className="text-green-500" />
                                                <span className="text-sm">{transaction.schedule.route.origin.city}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FaLocationDot className="text-red-500" />
                                                <span className="text-sm">{transaction.schedule.route.destination.city}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <FaClock className="text-gray-400" />
                                                <span>{new Date(transaction.schedule.departure_time).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => openPassengerModal(transaction.passengers)}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <FaUsers />
                                            <span>{transaction.passengers.length} Passengers</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <FaMoneyBill className="text-green-600" />
                                            <span>Rp {parseInt(transaction.total_price).toLocaleString()}</span>
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
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Passenger Details</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {selectedPassengers.map((passenger) => (
                                    <tr key={passenger.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{passenger.id_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{passenger.seat_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
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
                                ? 'bg-blue-600 text-white'
                                : link.url 
                                ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                    </button>
                ))}
            </div>
        </div>
    );
}