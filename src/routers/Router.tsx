import { createBrowserRouter } from "react-router";
import Login from "../pages/auth/LoginPages";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import AppLayouts from "../pages/root";
import Registrasi from "../pages/auth/RegistrasiPage";
import { Dashboard } from "../pages/admin/dashboard";
import { HomePage } from "../pages/HomePage";
import { BookingPage } from "../pages/Customers/BookingPage";
import { PaymentPage } from "../pages/Customers/PaymentPage";
import { SuccessPage } from "../pages/Customers/SuccessPage";
import AdminLayout from "../Layouts/AdminLayout";
import TransactionPage from "../pages/admin/transactions";
import TrainsPage from "../pages/admin/trains";


const Router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayouts/>,
        children: [
            {
                path: '/',
                element: <HomePage/> 
            },
             {
                path: "/booking/:id",
                element: <BookingPage />, // Form penumpang
            },
            {
                path: "/payment/:id",
                element: <PaymentPage />, // Ringkasan dan simulasi bayar
            },
            {
                path: "/success/:bookingId",
                element: <SuccessPage />,
            },
            {
                path: '/auth/login',
                element: <Login/>
            },
            {
                path: '/auth/registrasi',
                element: <Registrasi/>
            },
            {
                path: '/unauthorized',
                element: <Unauthorized/>
            }
        ],
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/admin/dashboard',
                element: <Dashboard/>
            },
            {
                path: '/admin/transactions',
                element: <TransactionPage/>
            },
            {
                path: '/admin/trains',
                element: <TrainsPage/>
            }
        ]

    }
]);

export default Router;