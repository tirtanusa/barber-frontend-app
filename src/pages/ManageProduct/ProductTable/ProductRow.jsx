import React from "react";
import { Edit2, Trash2, RefreshCw, PackageX, AlertTriangle } from "lucide-react";

const statusConfig = {
  available: {
    label: "Available",
    bg: "bg-green-100",
    text: "text-green-700",
  },
  out_of_stock: {
    label: "Out of Stock",
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

const formatCategory = (cat) => {
  if (!cat) return "—";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const getRowHighlight = (stock) => {
  if (stock === 0) return "bg-red-50 border-l-4 border-l-red-500";
  if (stock <= 10) return "bg-yellow-50 border-l-4 border-l-yellow-400";
  return "";
};

const ProductRow = ({ product, onEdit, onUpdateStock, onDelete }) => {
  const s = statusConfig[product.status] ?? {
    label: product.status,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  const rowHighlight = getRowHighlight(product.stock);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <tr
      className={`transition-colors border-b border-black/10 last:border-0 hover:brightness-95 ${rowHighlight}`}
    >
      {/* Name */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono font-bold text-sm uppercase">{product.name}</span>
          {product.description && (
            <span
              className="font-mono text-[10px] text-black/50 truncate max-w-[180px]"
              title={product.description}
            >
              {product.description}
            </span>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 font-mono text-xs text-black/70">
        {formatCategory(product.category)}
      </td>

      {/* Price */}
      <td className="px-6 py-4 font-mono text-xs font-bold">
        IDR {Number(product.price).toLocaleString("id-ID")}
      </td>

      {/* Stock */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          {isOutOfStock && <PackageX size={13} className="text-red-500 shrink-0" />}
          {isLowStock && <AlertTriangle size={13} className="text-yellow-500 shrink-0" />}
          <span
            className={`font-mono text-xs font-bold ${isOutOfStock ? "text-red-600" : isLowStock ? "text-yellow-600" : "text-black"
              }`}
          >
            {product.stock}
          </span>
          {isLowStock && (
            <span className="font-mono text-[9px] text-yellow-600 uppercase tracking-wider">low</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`font-mono text-[10px] uppercase px-2 py-1 font-bold whitespace-nowrap ${s.bg} ${s.text} ${s.border}`}
        >
          {s.label}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Update Stock */}
          <button
            onClick={() => onUpdateStock(product)}
            className="p-1.5 hover:text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors"
            title="Update Stock"
          >
            <RefreshCw size={15} />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
            title="Edit Product"
          >
            <Edit2 size={15} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            title="Delete Product"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
