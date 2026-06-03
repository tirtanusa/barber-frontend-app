import React from "react";
import { Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const DAY_STRINGS = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday"
};

const ScheduleList = ({ schedules, onToggleActive, onEdit, onDelete }) => {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return (
      <div className="border border-dashed border-black/30 p-6 text-center bg-white/50">
        <p className="font-mono text-xs text-black/40 uppercase tracking-widest font-bold">
          No Schedule Set for this Barber
        </p>
      </div>
    );
  }

  // Sort by day_of_week logically (Monday to Sunday)
  const sortedSchedules = [...schedules].sort((a, b) => {
    return (a.day_of_week || 99) - (b.day_of_week || 99);
  });

  return (
    <div className="overflow-x-auto border-2 border-black bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black/5 border-b-2 border-black font-mono text-xs uppercase font-bold text-black">
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Start Time</th>
            <th className="px-4 py-3">End Time</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs text-black divide-y divide-black/10">
          {sortedSchedules.map((schedule) => {
            const isActive = schedule.is_active !== false;
            const dayName = DAY_STRINGS[schedule.day_of_week] || "Unknown";
            return (
              <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold uppercase">{dayName}</td>
                <td className="px-4 py-3">{schedule.start_time.slice(0, 5)}</td>
                <td className="px-4 py-3">{schedule.end_time.slice(0, 5)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onToggleActive(schedule)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 border font-bold uppercase text-[9px] ${
                        isActive
                          ? "bg-green-50 border-green-400 text-green-700"
                          : "bg-red-50 border-red-400 text-red-700"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => onToggleActive(schedule)}
                      className="p-1 hover:text-black transition-colors"
                      title={isActive ? "Deactivate" : "Activate"}
                    >
                      {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(schedule)}
                      className="p-1 hover:text-blue-600 transition-colors"
                      title="Edit Schedule Time"
                    >
                      <Edit2 size={14} />
                    </button>
                    
                    {/* Delete */}
                    <button
                      onClick={() => onDelete(schedule.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Schedule Day"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
