import React from "react";

const BookingFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-xs text-black/50 tracking-widest uppercase">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="border-2 border-black px-3 py-2 font-mono text-sm bg-white outline-none focus:bg-gray-50 min-w-[150px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-xs text-black/50 tracking-widest uppercase">
          Date
        </label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange("date", e.target.value)}
          className="border-2 border-black px-3 py-2 font-mono text-sm bg-white outline-none focus:bg-gray-50"
        />
      </div>

      {(filters.status !== "" || filters.date !== "") && (
        <button
          onClick={() => {
            onFilterChange("status", "");
            onFilterChange("date", "");
          }}
          className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono text-sm transition-colors duration-200"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default BookingFilters;
