import "./App.css";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Booking from "./pages/booking";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/user/dashboard" element={<UserDashboard />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/booking" element={<Booking />}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
