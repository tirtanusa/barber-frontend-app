import React from "react";
import { Search } from "lucide-react";

const ProductSearch = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-black/60" />
      </div>
      <input
        type="text"
        placeholder="Cari produk..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 font-mono text-sm border-2 border-black bg-white outline-none focus:bg-gray-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-black/40"
      />
    </div>
  );
};

export default ProductSearch;
