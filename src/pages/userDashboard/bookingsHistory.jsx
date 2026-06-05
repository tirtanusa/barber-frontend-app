const statusConfig = {
    completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600", border: "border-red-300" },
    pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
    confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
};

const BookingHistory = ({ id, booking_date, service, barber, start_time, status, onViewDetail }) => {
    const s = statusConfig[status] ?? { label: status, bg: "bg-zinc-100", text: "text-zinc-500", border: "border-zinc-200" };

    return (
        <div className="border border-black/30 bg-white/60 hover:bg-white transition-colors duration-200">
            {/* top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/20">
                <span className="font-azeretMono text-[10px] tracking-widest uppercase text-black">
                    <span className="font-bold">#{String(id).padStart(4, "0")}</span> · {booking_date?.slice(0, 10)}
                </span>
                <span className={`font-azeretMono text-[10px] tracking-widest uppercase px-2 py-1 border ${s.bg} ${s.text} ${s.border}`}>
                    {s.label}
                </span>
            </div>

            {/* body */}
            <div className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <p className="font-mono font-bold text-black text-sm uppercase tracking-tight">{service?.name ?? "—"}</p>
                    <p className="font-mono text-xs text-black">{barber?.name ?? "—"} · {start_time?.slice(0, 5)}</p>
                </div>

                <button
                    onClick={onViewDetail}
                    className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase border border-black/20 px-4 py-2 text-black hover:bg-black hover:text-white hover:border-black transition-colors duration-200 self-end md:self-auto cursor-pointer"
                >
                    View Detail
                </button>
            </div>
        </div>
    );
};

export default BookingHistory;