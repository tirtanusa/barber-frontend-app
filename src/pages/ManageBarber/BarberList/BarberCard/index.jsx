import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, User } from "lucide-react";
import BarberActions from "./BarberActions";
import ScheduleSection from "./ScheduleSection";

const BarberCard = ({
  barber,
  onToggleActive,
  onEdit,
  onDelete,
  schedules,
  fetchSchedules,
  setSchedules,
  showNotification,
  token,
  BASE,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandToggle = () => {
    if (!isExpanded) {
      // Clear previous schedules and fetch fresh data for this barber
      setSchedules([]);
      fetchSchedules(barber.id);
    }
    setIsExpanded(!isExpanded);
  };

  const name = barber.name || barber.barber_name || "Barber";
  const rating = Number(barber.rating ?? 0);
  const isActive = barber.is_active !== false;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      {/* Barber Core Info */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 border-2 border-black bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
            {barber.photo ? (
              <img
                src={`${BASE.replace("/api", "")}/${barber.photo}`}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={28} className="text-black/35" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-mono font-black text-lg uppercase tracking-tight text-black">
                {name}
              </h3>
              <span
                className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                  isActive
                    ? "bg-green-100 border-green-400 text-green-800"
                    : "bg-red-100 border-red-400 text-red-800"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="font-mono text-xs text-black/60 line-clamp-2 max-w-xl">
              {barber.bio || "No bio description provided."}
            </p>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="font-mono text-xs text-black font-semibold">
                {rating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Expand Button */}
        <div className="flex flex-wrap items-center gap-4">
          <BarberActions
            barber={barber}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />

          <button
            onClick={handleExpandToggle}
            className="flex items-center gap-2 border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <span>Schedule</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Schedule Section */}
      {isExpanded && (
        <div className="bg-neutral-50/50 p-6 border-t-2 border-black animate-fadeIn">
          <ScheduleSection
            barberId={barber.id}
            schedules={schedules}
            fetchSchedules={fetchSchedules}
            showNotification={showNotification}
            token={token}
            BASE={BASE}
          />
        </div>
      )}
    </div>
  );
};

export default BarberCard;
