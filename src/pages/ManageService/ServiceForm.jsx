import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const ServiceForm = ({ isOpen, onClose, mode, service, onSuccess, token, BASE }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && service) {
        setName(service.name || "");
        setDescription(service.description || "");
        setPrice(service.price || "");
        setDuration(service.duration_minutes || "");
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setDuration("");
      }
      setError("");
    }
  }, [isOpen, mode, service]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !duration) {
      setError("Name, price, and duration are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        duration_minutes: Number(duration),
      };

      if (mode === "add") {
        await axios.post(`${BASE}/services`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Service added successfully!");
      } else {
        await axios.put(`${BASE}/services/${service.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Service updated successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Error saving service:", err);
      setError(err.response?.data?.message || "Failed to save service details.");
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
            {mode === "edit" ? "Edit Service" : "Add New Service"}
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

          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
              placeholder="e.g., Premium Haircut"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Description <span className="text-[10px] font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none custom-scrollbar"
              placeholder="Detail about the service..."
            ></textarea>
          </div>

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
                Duration (Mins)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
                placeholder="30"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 bg-yellow-50 border-2 border-yellow-400 font-mono text-[10px] text-yellow-800">
              <span className="font-bold">Note:</span> Changing the duration of a service might affect the generate slot logic. Existing generated slots will not change.
            </div>
          </div>

          {/* Form Actions */}
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
              {isSubmitting ? "Saving..." : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
