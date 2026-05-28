import "./App.css";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Booking from "./pages/booking";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/booking" element={<Booking />}></Route>
      </Routes>
    </>
  );
}

export default App;
