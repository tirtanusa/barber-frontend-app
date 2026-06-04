import React, { useState, useEffect } from "react";
import { X, RefreshCw, AlertTriangle } from "lucide-react";
import axios from "axios";

const UpdateStockForm = ({ isOpen, onClose, product, onSuccess, token, BASE }) => {
  const [newStock, setNewStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      setNewStock(product.stock ?? "");
      setError("");
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const stockNum = Number(newStock);
  const autoStatus = stockNum === 0 ? "out_of_stock" : "available";
  const currentChanged = String(newStock) !== String(product.stock);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newStock === "" || newStock === null) {
      setError("Please enter a stock value.");
      return;
    }
    if (stockNum < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${BASE}/products/${product.id}/stock`,
        { stock: stockNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess(`Stock for "${product.name}" updated to ${stockNum}.`);
      onClose();
    } catch (err) {
      console.error("Error updating stock:", err);
      setError(err.response?.data?.message || "Failed to update stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black px-6 py-4">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-teal-600" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider text-black">
              Update Stock
            </h3>
          </div>
          <button onClick={onClose} className="hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Info */}
          <div className="p-3 bg-black/5 border-2 border-black/20">
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/50 mb-0.5">
              Product
            </p>
            <p className="font-mono text-sm font-bold uppercase">{product.name}</p>
            <p className="font-mono text-xs text-black/50 mt-0.5">
              Current Stock:{" "}
              <span
                className={`font-bold ${
                  product.stock === 0
                    ? "text-red-600"
                    : product.stock <= 10
                    ? "text-yellow-600"
                    : "text-black"
                }`}
              >
                {product.stock}
              </span>
            </p>
          </div>

          {error && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 font-mono text-xs">
              {error}
            </div>
          )}

          {/* New Stock Input */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              New Stock Quantity
            </label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              min="0"
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none text-center text-lg font-bold"
              placeholder="0"
              autoFocus
              required
            />
          </div>

          {/* Auto-status preview */}
          {currentChanged && newStock !== "" && (
            <div
              className={`p-3 border-2 font-mono text-xs flex items-start gap-2 ${
                stockNum === 0
                  ? "bg-red-50 border-red-400 text-red-700"
                  : "bg-green-50 border-green-400 text-green-700"
              }`}
            >
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              <span>
                Status will automatically be set to{" "}
                <span className="font-bold uppercase">
                  {autoStatus === "out_of_stock" ? "Out of Stock" : "Available"}
                </span>{" "}
                after saving.
              </span>
            </div>
          )}

          {/* Warning: negative */}
          {newStock !== "" && stockNum < 0 && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 font-mono text-xs">
              Stock cannot be negative.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border-2 border-black font-mono text-xs font-bold uppercase hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || newStock === "" || stockNum < 0}
              className="px-6 py-2 bg-teal-600 text-white border-2 border-teal-600 font-mono text-xs font-bold uppercase hover:bg-white hover:text-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockForm;
