import "./App.css";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Booking from "./pages/booking";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";
import BookingManagement from "./pages/bookingManagement";
import TransactionProcess from "./pages/transactionProcess";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />}></Route>

        {/* Private Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/booking" element={<Booking />}></Route>
          <Route path="/user/dashboard" element={<UserDashboard />}></Route>
        </Route>

        {/* Private Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route path="/admin/booking-management" element={<BookingManagement />}></Route>
          <Route path="/admin/transaction-process" element={<TransactionProcess />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
