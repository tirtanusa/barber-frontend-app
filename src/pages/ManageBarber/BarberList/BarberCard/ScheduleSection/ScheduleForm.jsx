import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_MAPPING = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday"
};

const getDayOfWeekInt = (dayStr) => {
  return parseInt(Object.keys(DAY_MAPPING).find(key => DAY_MAPPING[key] === dayStr)) || 1;
};

const ScheduleForm = ({
  isOpen,
  onClose,
  mode,
  schedule,
  existingSchedules = [],
  barberId,
  onSuccess,
  token,
  BASE,
}) => {
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && schedule) {
        setDay(DAY_MAPPING[schedule.day_of_week] || "Monday");
        setStartTime(schedule.start_time.slice(0, 5));
        setEndTime(schedule.end_time.slice(0, 5));
        setIsActive(schedule.is_active !== false);
      } else {
        // For add mode, pick the first available day that isn't scheduled yet
        const scheduledDays = existingSchedules.map((s) => DAY_MAPPING[s.day_of_week]);
        const freeDay = DAYS_OF_WEEK.find((d) => !scheduledDays.includes(d)) || "Monday";
        setDay(freeDay);
        setStartTime("09:00");
        setEndTime("17:00");
        setIsActive(true);
      }
      setError("");
    }
  }, [isOpen, mode, schedule, existingSchedules]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate duplicate day:
    // Barber cannot have 2 schedules on the same day.
    const isDuplicate = existingSchedules.some(
      (s) => (DAY_MAPPING[s.day_of_week] || "").toLowerCase() === day.toLowerCase() && (mode === "add" || s.id !== schedule.id)
    );

    if (isDuplicate) {
      setError(`This barber already has a schedule for ${day}. Please select another day or edit the existing schedule.`);
      return;
    }

    if (startTime >= endTime) {
      setError("Start time must be earlier than End time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        barber_id: barberId,
        day_of_week: getDayOfWeekInt(day),
        start_time: startTime,
        end_time: endTime,
        is_active: isActive,
      };

      if (mode === "add") {
        await axios.post(`${BASE}/barber/${barberId}/schedule`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Work schedule added successfully!");
      } else {
        await axios.put(`${BASE}/barber/${barberId}/schedule/${schedule.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess("Work schedule updated successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError(err.response?.data?.message || "Failed to save work schedule details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black px-6 py-4">
          <h3 className="font-mono font-black text-sm uppercase tracking-wider text-black">
            {mode === "edit" ? "Edit Work Schedule" : "Add Work Schedule"}
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

          {/* Day selection */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Work Day
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="border-2 border-black p-3 font-mono text-sm focus:outline-none bg-white"
              disabled={mode === "edit"} // Prevent changing day when editing to preserve logic
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Start and End Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border-2 border-black p-3 font-mono text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between border-t border-black/15 pt-4">
            <div className="flex flex-col">
              <label className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                Active for Booking
              </label>
              <span className="font-mono text-[10px] text-black/40">
                Disable to temporarily stop slots generation for this day
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
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
              {isSubmitting ? "Saving..." : "Save Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
