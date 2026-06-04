import React from "react";
import { Filter } from "lucide-react";

const STATUSES = [
  { value: "", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const ProductFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-black/40">
        <Filter size={14} />
        <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Filter:</span>
      </div>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="border-2 border-black font-mono text-xs py-2 px-3 focus:outline-none bg-white cursor-pointer"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Clear Filter */}
      {filters.status && (
        <button
          onClick={() => onFilterChange("status", "")}
          className="font-mono text-[10px] uppercase tracking-widest text-black/50 hover:text-red-600 underline transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default ProductFilter;
