import React from "react";

const BarberFilter = ({ filterActive, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 border-2 border-black">
      <span className="font-mono text-xs uppercase tracking-widest text-black/50 font-bold">
        Filter Active Status:
      </span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange("")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
            filterActive === ""
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          All Status
        </button>
        <button
          onClick={() => onFilterChange("true")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
            filterActive === "true"
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          Active Only
        </button>
        <button
          onClick={() => onFilterChange("false")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
            filterActive === "false"
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          Inactive Only
        </button>
      </div>
    </div>
  );
};

export default BarberFilter;
