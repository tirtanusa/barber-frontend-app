import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";



const ProductForm = ({ isOpen, onClose, mode, product, onSuccess, token, BASE }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("hair_care");
  const [status, setStatus] = useState("available");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && product) {
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price || "");
        setStock(product.stock ?? "");
        setCategory(product.category || "hair_care");
        setStatus(product.status || "available");
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setCategory("hair_care");
        setStatus("available");
      }
      setError("");
    }
  }, [isOpen, mode, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || price === "" || stock === "") {
      setError("Name, price, and initial stock are required.");
      return;
    }
    if (Number(stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        status,
      };

      if (mode === "add") {
        await axios.post(`${BASE}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Product added successfully!");
      } else {
        await axios.put(`${BASE}/products/${product.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Product updated successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black px-6 py-4 sticky top-0 bg-white z-10">
          <h3 className="font-mono font-black text-sm uppercase tracking-wider text-black">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h3>
          <button onClick={onClose} className="hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 font-mono text-xs">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
              placeholder="e.g., Pomade Classic"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Description <span className="text-[10px] font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none custom-scrollbar"
              placeholder="Details about the product..."
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                Price (IDR)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
                placeholder="0"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                {mode === "edit" ? "Stock" : "Initial Stock"}
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
              placeholder="e.g., Hair Care, Styling, Tools..."
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Status
            </label>
            <div className="flex gap-3">
              {["available", "out_of_stock"].map((s) => (
                <label
                  key={s}
                  className={`flex-1 flex items-center justify-center gap-2 border-2 p-3 cursor-pointer transition-all font-mono text-xs font-bold uppercase ${
                    status === s
                      ? "border-black bg-black text-white"
                      : "border-black/30 hover:border-black text-black/60 hover:text-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="hidden"
                  />
                  {s === "available" ? "Available" : "Out of Stock"}
                </label>
              ))}
            </div>
          </div>

          {/* Note for edit */}
          {mode === "edit" && (
            <div className="p-3 bg-yellow-50 border-2 border-yellow-400 font-mono text-[10px] text-yellow-800">
              <span className="font-bold">Note:</span> To update stock separately, use the{" "}
              <span className="font-bold">Update Stock</span> action button in the table.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white border-2 border-black font-mono text-xs font-bold uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
