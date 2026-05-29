import { Calendar, Clock, X } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const ActiveBookings = ({ id, barber, service, booking_date, start_time, status, onCancelled }) => {
    const { token } = useContext(AuthContext);

    const handleCancel = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/bookings/${id}/cancel`,
                { status: "cancelled" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onCancelled(id); // ← beritahu parent agar hapus dari list
        } catch (err) {
            console.error("Cancel failed:", err);
        }
    };

    const statusConfig = {
        pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
        confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
        in_progress: { label: "In Progress", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
    };
    const s = statusConfig[status] ?? { label: status, bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-300" };

    return (
        <div className="border border-black/30 bg-white hover:border-black/30 transition-colors duration-200">
            {/* top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/20">
                <span className="font-mono text-[10px] tracking-widest uppercase text-black/40">
                    #{String(id).padStart(4, "0")}
                </span>
                <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border ${s.bg} ${s.text} ${s.border}`}>
                    {s.label}
                </span>
            </div>

            {/* body */}
            <div className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* barber + service */}
                <div className="flex flex-col gap-1">
                    <p className="font-mono font-bold text-black text-sm uppercase tracking-tight">{barber?.name ?? "—"}</p>
                    <p className="font-mono text-xs text-black/50">{service?.name ?? "—"}</p>
                </div>

                {/* date + time */}
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-black/40 shrink-0" />
                        <div>
                            <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest">Date</p>
                            <p className="font-mono text-sm font-semibold text-black">{booking_date?.slice(0, 10)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-black/40 shrink-0" />
                        <div>
                            <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest">Time</p>
                            <p className="font-mono text-sm font-semibold text-black">{start_time?.slice(0, 5)}</p>
                        </div>
                    </div>
                </div>

                {/* cancel */}
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase border border-black/20 px-4 py-2 text-black hover:bg-black hover:text-white hover:border-black transition-colors duration-200 self-end md:self-auto"
                >
                    <X size={12} /> Cancel
                </button>
            </div>
        </div>
    );
};

export default ActiveBookings;