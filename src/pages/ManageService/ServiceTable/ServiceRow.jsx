import React from "react";
import { Edit2, Trash2, Clock } from "lucide-react";

const ServiceRow = ({ service, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-black/10 last:border-0">
      <td className="px-6 py-4 font-bold">{service.id}</td>
      <td className="px-6 py-4 font-bold uppercase">{service.name}</td>
      <td className="px-6 py-4 text-black/60 truncate max-w-[200px]" title={service.description}>
        {service.description || "-"}
      </td>
      <td className="px-6 py-4">
        IDR {Number(service.price).toLocaleString("id-ID")}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-black/50" />
          <span>{service.duration_minutes} Min</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Edit */}
          <button
            onClick={() => onEdit(service)}
            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
            title="Edit Service"
          >
            <Edit2 size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(service)}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            title="Delete Service"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ServiceRow;
