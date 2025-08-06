// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import Router from './routers/Router';
import './index.css'
import { BookingStore } from './store/BookingStore';

BookingStore.getState().expireOldBookings();
ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>
);
