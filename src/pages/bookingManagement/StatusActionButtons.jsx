import React from "react";
import { useNavigate } from "react-router-dom";

const StatusActionButtons = ({ status, onUpdateStatus, bookingId }) => {
  const navigate = useNavigate();

  if (status === "completed") {
    return (
      <div className="text-center font-mono text-sm text-green-600 font-bold border-2 border-green-500 bg-green-50 p-2">
        Booking Completed
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="text-center font-mono text-sm text-red-600 font-bold border-2 border-red-500 bg-red-50 p-2">
        Booking Cancelled
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {status === "pending" && (
        <>
          <button
            onClick={() => onUpdateStatus("confirmed")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Confirm Booking
          </button>
          <button
            onClick={() => onUpdateStatus("cancelled")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Cancel Booking
          </button>
        </>
      )}

      {status === "confirmed" && (
        <>
          <button
            onClick={() => onUpdateStatus("in_progress")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Start Session (In Progress)
          </button>
          <button
            onClick={() => navigate(`/admin/transaction-process?bookingId=${bookingId}`)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Proses Transaksi (Checkout)
          </button>
          <button
            onClick={() => onUpdateStatus("cancelled")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Cancel Booking
          </button>
        </>
      )}

      {status === "in_progress" && (
        <>
          <button
            onClick={() => onUpdateStatus("completed")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Complete Session
          </button>
          <button
            onClick={() => navigate(`/admin/transaction-process?bookingId=${bookingId}`)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer"
          >
            Proses Transaksi (Checkout)
          </button>
        </>
      )}
    </div>
  );
};

export default StatusActionButtons;
