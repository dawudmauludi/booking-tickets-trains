import { createBrowserRouter } from "react-router";
import Login from "../pages/auth/LoginPages";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import AppLayouts from "../pages/root";
import Registrasi from "../pages/auth/RegistrasiPage";
import { Dashboard } from "../pages/admin/Dashboard";
import { HomePage } from "../pages/HomePage";
import { BookingPage } from "../pages/Customers/BookingPage";
import { PaymentPage } from "../pages/Customers/PaymentPage";
import { SuccessPage } from "../pages/Customers/SuccessPage";

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
                path: "/admin/dashboard",
                element:(
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard/>
                    </ProtectedRoute>
                )  
            },
            {
                path: '/unauthorized',
                element: <Unauthorized/>
            }
        ]
    }
]);

export default Router;