import { Link } from "react-router-dom";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import ActiveBookings from "./activeBookings";
import BookingHistory from "./bookingsHistory";
import axios from "axios";

const SectionLabel = ({ color, label }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 ${color}`} />
        <p className="font-mono text-[10px] md:text-lg tracking-widest uppercase text-black">{label}</p>
    </div>
);

const EmptyState = ({ label }) => (
    <div className="border border-dashed border-black/30 px-5 py-8 text-center">
        <p className="font-mono text-xs text-black tracking-widest uppercase">{label}</p>
    </div>
);

const UserDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [activeBookings, setActiveBookings] = useState([]);
    const [bookingsHistory, setBookingsHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_BASE_URL}/bookings/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const all = res.data.data.data ?? [];
                setActiveBookings(all.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status)));
                setBookingsHistory(all.filter(b => ['completed', 'cancelled'].includes(b.status)));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBookings(); }, []);

    // ← dipanggil oleh ActiveBookings setelah cancel berhasil
    const handleCancelled = (cancelledId) => {
        const cancelled = activeBookings.find(b => b.id === cancelledId);
        setActiveBookings(prev => prev.filter(b => b.id !== cancelledId));
        if (cancelled) {
            setBookingsHistory(prev => [{ ...cancelled, status: "cancelled" }, ...prev]);
        }
    };

    const firstName = user?.name?.split(" ")[0] ?? "User";

    return (
        <div className="min-h-screen bg-white">
            {/* header */}
            <div className="px-6 md:mx-12 py-10 border-b border-black/20">
                <Link
                    to="/"
                    className="md:-mx-2 border-b border-black w-fit hover:text-[14px] flex items-center gap-2 font-mono text-xs text-black md:text-[12px] hover:text-black tracking-widest uppercase mb-8 transition-colors duration-200"
                >
                    <ArrowLeft size={13} /> Back to Home
                </Link>
                <p className="font-mono text-[10px] tracking-widest uppercase text-black mb-1 md:text-lg">Dashboard</p>
                <h1 className="font-mono font-black text-[48px] md:text-[72px] uppercase leading-none text-black tracking-tight">
                    Halo, {firstName}
                </h1>
            </div>

            {/* content */}
            <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row gap-12 md:gap-16">

                {/* active bookings */}
                <div className="flex-1">
                    <SectionLabel color="bg-amber-400" label="Active Bookings" />
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-black/5 animate-pulse" />)}
                        </div>
                    ) : activeBookings.length === 0 ? (
                        <EmptyState label="No active bookings" />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {activeBookings.map(b => (
                                <ActiveBookings
                                    key={b.id}
                                    {...b}
                                    onCancelled={handleCancelled}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* divider */}
                <div className="hidden md:block w-px bg-black/5" />

                {/* history */}
                <div className="flex-1">
                    <SectionLabel color="bg-black/20" label="Booking History" />
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-black/5 animate-pulse" />)}
                        </div>
                    ) : bookingsHistory.length === 0 ? (
                        <EmptyState label="No booking history" />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {bookingsHistory.map(b => (
                                <BookingHistory key={b.id} {...b} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FAB Book Now */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link
                    to="/booking"
                    className="flex items-center gap-2 bg-black text-white font-mono text-xs tracking-widest uppercase px-5 py-3 hover:bg-zinc-800 transition-colors duration-200 shadow-lg"
                >
                    <CalendarPlus size={15} /> Book Now
                </Link>
            </div>
        </div>
    );
};

export default UserDashboard;