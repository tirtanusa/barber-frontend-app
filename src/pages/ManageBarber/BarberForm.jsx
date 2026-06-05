import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const BarberForm = ({ isOpen, onClose, mode, barber, onSuccess, token, BASE }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    rating: 5.0,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && barber) {
        setFormData({
          name: barber.name || barber.barber_name || "",
          bio: barber.bio || "",
          rating: barber.rating != null ? Number(barber.rating) : 5.0,
          is_active: barber.is_active !== false,
        });
      } else {
        setFormData({
          name: "",
          bio: "",
          rating: 5.0,
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, barber]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    const rate = Number(formData.rating);
    if (isNaN(rate) || rate < 0 || rate > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
        rating: Number(formData.rating),
        is_active: formData.is_active,
      };

      if (mode === "add") {
        // Try /barber or /barbers path
        await axios.post(`${BASE}/barber/add-barber`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Barber added successfully!");
      } else {
        try {
          await axios.put(`${BASE}/barber/${barber.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          await axios.put(`${BASE}/barbers/${barber.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        onSuccess("Barber updated successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting barber form:", error);
      const errMsg = error.response?.data?.message || "Failed to save barber details";
      setErrors({ api: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black px-6 py-4">
          <h3 className="font-mono font-black text-lg uppercase tracking-wider">
            {mode === "edit" ? "Edit Barber" : "Add New Barber"}
          </h3>
          <button onClick={onClose} className="hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.api && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 font-mono text-xs">
              {errors.api}
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-gray-50 transition-colors ${errors.name ? "border-red-500" : ""
                }`}
              placeholder="e.g. John Doe"
            />
            {errors.name && (
              <span className="font-mono text-[10px] text-red-500">{errors.name}</span>
            )}
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Bio (Optional)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-gray-50 transition-colors resize-none"
              placeholder="Tell a brief story about the artist..."
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Rating (0 - 5)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className={`border-2 border-black p-3 font-mono text-sm w-32 focus:outline-none ${errors.rating ? "border-red-500" : ""
                  }`}
              />
              <span className="font-mono text-xs text-black/40">Use 0.1 steps</span>
            </div>
            {errors.rating && (
              <span className="font-mono text-[10px] text-red-500">{errors.rating}</span>
            )}
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between border-t border-black/15 pt-4">
            <div className="flex flex-col">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                Is Active Status
              </label>
              <span className="font-mono text-[10px] text-black/40">
                Inactive barbers won't appear on booking screen
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

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
              {isSubmitting ? "Saving..." : "Save Barber"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberForm;
