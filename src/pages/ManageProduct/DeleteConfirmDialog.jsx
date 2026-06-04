import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black px-6 py-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider text-black">
              Confirm Delete
            </h3>
          </div>
          <button onClick={onClose} className="hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="font-mono text-sm text-black mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">"{productName}"</span>?
          </p>
          <p className="font-mono text-xs text-black/60">
            Note: This is a soft delete — the product data will be hidden but not permanently removed.
          </p>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t-2 border-black">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-black font-mono text-xs font-bold uppercase hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 text-white border-2 border-black font-mono text-xs font-bold uppercase hover:bg-white hover:text-red-600 transition-all"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
