import React from "react";
import { Eye } from "lucide-react";

const statusConfig = {
  completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600", border: "border-red-300" },
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  in_progress: { label: "In Progress", bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" }
};

const BookingRow = ({ booking, onViewDetail }) => {
  const s = statusConfig[booking.status] ?? {
    label: booking.status,
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-mono font-bold">
        #{String(booking.id).padStart(4, "0")}
      </td>
      <td className="px-4 py-3 font-mono truncate max-w-[150px]">
        {booking.user?.name || "—"}
      </td>
      <td className="px-4 py-3 font-mono truncate max-w-[150px]">
        {booking.barber?.name || "—"}
      </td>
      <td className="px-4 py-3 font-mono truncate max-w-[150px]">
        {booking.service?.name || "—"}
      </td>
      <td className="px-4 py-3 font-mono whitespace-nowrap">
        {booking.booking_date?.slice(0, 10)}
      </td>
      <td className="px-4 py-3 font-mono whitespace-nowrap">
        {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`font-mono text-[10px] md:text-xs uppercase px-2 py-1 border font-bold whitespace-nowrap ${s.bg} ${s.text} ${s.border}`}
        >
          {s.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onViewDetail(booking)}
          className="border border-black p-1.5 md:p-2 transition-all hover:bg-black hover:text-white"
          title="View Details"
        >
          <Eye size={14} />
        </button>
      </td>
    </tr>
  );
};

export default BookingRow;
