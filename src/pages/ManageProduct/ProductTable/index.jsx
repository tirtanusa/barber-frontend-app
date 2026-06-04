import React from "react";
import ProductRow from "./ProductRow";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductTable = ({
  products,
  isLoading,
  onEdit,
  onUpdateStock,
  onDelete,
  pagination,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-mono text-sm font-bold uppercase tracking-widest animate-pulse">
          Loading Products...
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-black/50">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-200 border border-yellow-400" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-black/60">
            Low Stock (≤ 10)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-200 border border-red-400" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-black/60">
            Out of Stock
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="bg-black/5 border-b-2 border-black font-mono text-xs uppercase font-bold text-black tracking-wider">
              <th className="px-6 py-4 w-1/4">Name</th>
              <th className="px-6 py-4 w-1/6">Category</th>
              <th className="px-6 py-4 w-1/6">Price</th>
              <th className="px-6 py-4 w-24">Stock</th>
              <th className="px-6 py-4 w-32">Status</th>
              <th className="px-6 py-4 text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs text-black">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onUpdateStock={onUpdateStock}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between pt-4 border-t-2 border-black mt-4">
          <span className="font-mono text-xs text-black/60">
            Page <span className="font-bold text-black">{pagination.currentPage}</span> of{" "}
            <span className="font-bold text-black">{pagination.lastPage}</span>
            {" "}— {pagination.total} products total
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-2 border-2 border-black font-mono text-xs font-bold hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.lastPage ||
                  Math.abs(p - pagination.currentPage) <= 1
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="font-mono text-xs px-1">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => onPageChange(item)}
                    className={`w-8 h-8 border-2 border-black font-mono text-xs font-bold transition-all ${
                      item === pagination.currentPage
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.lastPage}
              className="p-2 border-2 border-black font-mono text-xs font-bold hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
