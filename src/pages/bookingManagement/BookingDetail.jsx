import React from "react";
import { X, Clock, DollarSign, Calendar, User, Scissors } from "lucide-react";
import StatusActionButtons from "./StatusActionButtons";

const statusConfig = {
  completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600", border: "border-red-300" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  in_progress: { label: "In Progress", bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" }
};

const BookingDetail = ({ isOpen, onClose, booking, onUpdateStatus, isProcessing }) => {
  if (!isOpen || !booking) return null;

  const s = statusConfig[booking.status] ?? {
    label: booking.status,
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-gray-50">
          <h3 className="text-black font-mono font-bold text-lg uppercase tracking-tight">
            Booking Details #{String(booking.id).padStart(4, "0")}
          </h3>
          <button onClick={onClose} className="text-black hover:bg-gray-200 p-1 border border-transparent hover:border-black transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b pb-3">
            <span className="font-mono text-xs text-black/50 uppercase tracking-widest">Current Status</span>
            <span className={`font-mono text-xs uppercase px-2.5 py-1 border font-bold ${s.bg} ${s.text} ${s.border}`}>
              {s.label}
            </span>
          </div>

          {/* Info Rows */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User size={18} className="mt-0.5 text-black/60 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider">Customer</p>
                <p className="font-mono text-sm font-bold text-black">{booking.user?.name || "—"}</p>
                <p className="font-mono text-xs text-black/60">{booking.user?.email || ""}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Scissors size={18} className="mt-0.5 text-black/60 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider">Barber</p>
                <p className="font-mono text-sm font-bold text-black">{booking.barber?.name || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 text-black/60 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider">Service</p>
                <p className="font-mono text-sm font-bold text-black">{booking.service?.name || "—"}</p>
                <p className="font-mono text-xs text-black/60">Duration: {booking.service?.duration_minutes || "—"} mins</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-0.5 text-black/60 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider">Date & Time</p>
                <p className="font-mono text-sm font-bold text-black">
                  {booking.booking_date?.slice(0, 10)} @ {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign size={18} className="mt-0.5 text-black/60 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider">Price</p>
                <p className="font-mono text-sm font-bold text-black">
                  Rp {Number(booking.service?.price || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="border-t pt-3">
                <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider mb-1">Customer Notes</p>
                <p className="font-mono text-xs text-black bg-gray-50 p-3 border border-dashed border-black/20 italic">
                  "{booking.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 border-t-2 border-black bg-gray-50">
          {isProcessing ? (
            <div className="text-center font-mono text-sm text-black">Updating Status...</div>
          ) : (
            <StatusActionButtons
              status={booking.status}
              bookingId={booking.id}
              onUpdateStatus={onUpdateStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
