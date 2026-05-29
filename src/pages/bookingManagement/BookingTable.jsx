import React from "react";
import BookingRow from "./BookingRow";

const BookingTable = ({ bookings, isLoading, onViewDetail }) => {
  return (
    <div className="overflow-x-auto border-2 border-black bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-black/10 border-b-2 border-black font-mono text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Barber</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs md:text-sm">
          {isLoading && bookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500">
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent"></div>
                  Loading bookings...
                </div>
              </td>
            </tr>
          ) : bookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500 font-mono">
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onViewDetail={onViewDetail}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
