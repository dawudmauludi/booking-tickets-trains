import { createBrowserRouter } from "react-router";
import Login from "../pages/auth/LoginPages";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import AppLayouts from "../pages/root";
import Registrasi from "../pages/auth/RegistrasiPage";
import { Dashboard } from "../pages/admin/dashboard";
import { BookingPage } from "../pages/Customers/BookingPage";
import { PaymentPage } from "../pages/Customers/PaymentPage";
import { SuccessPage } from "../pages/Customers/SuccessPage";
import { HomePage } from "../pages/HomePage";
import { HistoryPage } from "../pages/Customers/HistoryPage";
import AdminLayout from "../Layouts/AdminLayout";
import RoutesPage from "../pages/admin/routes/index";
import TransactionPage from "../pages/admin/transactions";
import SchedulesPage from "../pages/admin/schedules";
import TrainsPage from "../pages/admin/trains";

import StationPage from "../pages/admin/stations";

const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayouts />,
    children: [
      {
        path: '/',
        element: <HomePage />
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
        element: <Login />
      },
      {
        path: '/auth/registrasi',
        element: <Registrasi />
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />
      }
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/admin/dashboard',
        element: <Dashboard />
      },
      {
        path: '/admin/transactions',
        element: <TransactionPage />
      },
      {
        path: '/admin/schedules',
        element: <SchedulesPage />
      }
    ]
  },
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
                path: "/payment/:bookingId", 
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
                path: '/history',
                element: <HistoryPage/>
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
                path: 'dashboard',
                element: <Dashboard/>
            },
            {
                path: 'routes',
                element: <RoutesPage/>
            },
            {
                path: 'transactions',
                element: <TransactionPage/>
            },
            {
                path: 'trains',
                element: <TrainsPage/>
            },
            {
                path: 'stations',
                element: <StationPage/>
            }
        ]
    }
]);

export default Router;
