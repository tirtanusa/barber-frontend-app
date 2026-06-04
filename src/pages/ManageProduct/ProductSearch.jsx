import React from "react";
import { Search } from "lucide-react";

const ProductSearch = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-black/50" />
      </div>
      <input
        type="text"
        placeholder="Search product by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border-2 border-black font-mono text-xs focus:outline-none focus:ring-0 placeholder:text-black/30"
      />
    </div>
  );
};

export default ProductSearch;
