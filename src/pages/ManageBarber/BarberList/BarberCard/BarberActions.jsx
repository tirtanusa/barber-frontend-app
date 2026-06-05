import React from "react";
import { Edit, Trash, ToggleLeft, ToggleRight } from "lucide-react";

const BarberActions = ({ barber, onEdit, onDelete, onToggleActive }) => {
  const isActive = !barber.is_active;

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Active Button */}
      <button
        onClick={() => onToggleActive(barber)}
        className={`p-2 border-2 border-black transition-all hover:bg-black hover:text-white ${isActive ? "bg-green-50" : "bg-red-50"
          }`}
        title={isActive ? "Deactivate Barber" : "Activate Barber"}
      >
        {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      </button>

      {/* Edit Barber Button */}
      <button
        onClick={() => onEdit(barber)}
        className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
        title="Edit Barber"
      >
        <Edit size={16} />
      </button>

      {/* Delete Barber Button */}
      <button
        onClick={() => onDelete(barber)}
        className="p-2 border-2 border-black bg-white text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
        title="Delete Barber"
      >
        <Trash size={16} />
      </button>
    </div>
  );
};

export default BarberActions;
