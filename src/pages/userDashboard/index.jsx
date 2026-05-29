import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import ActiveBookings from "./activeBookings";
import axios from "axios";
import BookingHistory from "./bookingsHistory";

const UserDashboard = () => {
    const { user, token } = useContext(AuthContext)
    const [bookings, setBookings] = useState([])
    const [activeBookings, setActiveBookings] = useState([])
    const [bookingsHistory, setBookingHistory] = useState([])
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/bookings/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setBookings(res.data.data.data)
                const active = res.data.data.data.filter(b =>
                    ['pending', 'confirmed', 'in_progress'].includes(b.status)
                );

                const history = res.data.data.data.filter(b =>
                    ['completed', 'cancelled'].includes(b.status)
                );

                setActiveBookings(active);
                setBookingHistory(history);
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <>
            <div className="flex flex-col mx-auto px-6 py-6">

                <Link to="/"
                    className="flex items-center gap-2 font-mono text-xs text-black/90 hover:text-black tracking-widest uppercase mb-10 transition-colors duration-200">
                    <ArrowLeft size={14} /> Back to Home
                </Link>
                <p className="flex items-center gap-2 font-azeretMono text-xs text-black/90 hover:text-black tracking-widest uppercase mb-2 transition-colors duration-200">
                    Halo,
                </p>
                <h1 className="font-inter font-black text-[36px] md:text-[56px] uppercase leading-none text-black truncate">
                    {user ? user.name.split(" ").slice(0, 1) : "User"}
                </h1>
            </div>

            <div className="flex items-start gap-4 mx-6 mt-10 ">
                <div className="w-3 h-3 bg-secondary/70 mt-1"></div>
                <p className="font-azeretMono text-sm text-black/90 hover:text-black tracking-widest uppercase mb-2 transition-colors duration-200">Active Booking</p>
            </div>
            {activeBookings.map(booking => (
                <ActiveBookings key={booking.id} props={booking} />
            ))}

            <div className="flex items-start gap-4 mx-6 mt-10 ">
                <div className="w-3 h-3 bg-black/60 mt-1"></div>
                <p className="font-azeretMono text-sm text-black/90 hover:text-black tracking-widest uppercase mb-2 transition-colors duration-200">Booking History</p>
            </div>
            {bookingsHistory.map(booking => (
                <BookingHistory key={booking.id} props={booking} />
            ))}

            <div className="sticky bottom-5 right-6 float-right">
                <div className="p-2 bg-black flex items-center justify-center gap-2">
                    <Plus size={22} /> Book Now
                </div>

            </div>
        </>
    )

}
export default UserDashboard;