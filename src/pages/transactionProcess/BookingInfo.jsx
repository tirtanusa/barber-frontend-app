import React from "react";
import { User, Scissors, Clock, Calendar, DollarSign } from "lucide-react";

const BookingInfo = ({ booking, bookingsList, onSelectBooking, isLoadingBookings }) => {
  return (
    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-mono font-black text-xl uppercase tracking-tight border-b-2 border-black pb-3 mb-4">
        Info Booking
      </h2>

      {!booking ? (
        <div className="space-y-4">
          <p className="font-mono text-xs text-black/60">
            Pilih booking dari daftar booking aktif (Confirmed / In Progress) untuk memproses pembayaran:
          </p>
          {isLoadingBookings ? (
            <p className="font-mono text-sm text-black">Loading bookings...</p>
          ) : bookingsList.length === 0 ? (
            <p className="font-mono text-sm text-red-500 font-bold border border-red-300 bg-red-50 p-3">
              Tidak ada booking yang berstatus Confirmed atau In Progress saat ini.
            </p>
          ) : (
            <select
              onChange={(e) => {
                const selected = bookingsList.find((b) => String(b.id) === e.target.value);
                if (selected) onSelectBooking(selected);
              }}
              defaultValue=""
              className="w-full border-2 border-black p-3 font-mono text-sm bg-white outline-none focus:bg-gray-50"
            >
              <option value="" disabled>-- Pilih Booking --</option>
              {bookingsList.map((b) => (
                <option key={b.id} value={b.id}>
                  Booking #{String(b.id).padStart(4, "0")} - {b.user?.name} ({b.status})
                </option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-black/10 pb-3">
            <span className="font-mono text-sm font-bold">Booking #{String(booking.id).padStart(4, "0")}</span>
            <span
              className={`font-mono text-xs uppercase px-2.5 py-1 border-2 border-black font-bold ${
                booking.status === "in_progress"
                  ? "bg-teal-100 text-teal-900"
                  : "bg-blue-100 text-blue-900"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">Customer</p>
                <p className="font-mono text-sm font-bold">{booking.user?.name || "—"}</p>
                <p className="font-mono text-xs text-black/60">{booking.user?.email || ""}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Scissors size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">Barber</p>
                <p className="font-mono text-sm font-bold">{booking.barber?.name || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">Layanan</p>
                <p className="font-mono text-sm font-bold">{booking.service?.name || "—"}</p>
                <p className="font-mono text-xs text-black/60">Durasi: {booking.service?.duration_minutes || "—"} mins</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">Tanggal & Jam</p>
                <p className="font-mono text-sm font-bold">
                  {booking.booking_date?.slice(0, 10)} @ {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">Harga Layanan</p>
                <p className="font-mono text-sm font-bold text-black">
                  Rp {Number(booking.service?.price || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="border-t border-black/10 pt-3">
                <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider mb-1">Catatan</p>
                <p className="font-mono text-xs italic bg-gray-50 p-2 border border-dashed border-black/20">
                  "{booking.notes}"
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectBooking(null)}
            className="w-full mt-2 font-mono text-xs border border-black py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Pilih Booking Lain
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingInfo;
