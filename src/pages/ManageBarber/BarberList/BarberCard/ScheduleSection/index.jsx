import React, { useState } from "react";
import { Plus, CalendarRange } from "lucide-react";
import axios from "axios";
import ScheduleList from "./ScheduleList";
import ScheduleForm from "./ScheduleForm";
import GenerateSlotForm from "./GenerateSlotForm";

const ScheduleSection = ({
  barberId,
  schedules,
  fetchSchedules,
  showNotification,
  token,
  BASE,
}) => {
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [isGenerating, setIsGenerating] = useState(false);

  const [targetDate, setTargetDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [slots, setSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch slots whenever targetDate changes
  React.useEffect(() => {
    const fetchSlots = async () => {
      if (!targetDate) return;
      setIsLoadingSlots(true);
      try {
        const response = await axios.get(
          `${BASE}/barber/${barberId}/slots?date=${targetDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedSlots = response.data?.data?.data || response.data?.data || response.data || [];
        setSlots(Array.isArray(fetchedSlots) ? fetchedSlots : []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [targetDate, barberId, token, BASE]);

  // Toggle active status for a specific schedule day
  const handleToggleScheduleActive = async (schedule) => {
    try {
      const updatedStatus = !schedule.is_active;
      await axios.put(
        `${BASE}/barber/${barberId}/schedule/${schedule.id}`,
        {
          barber_id: barberId,
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time.slice(0, 5),
          end_time: schedule.end_time.slice(0, 5),
          is_active: updatedStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Schedule status updated successfully.");
      fetchSchedules(barberId);
    } catch (error) {
      console.error("Error toggling schedule status:", error);
      showNotification("Failed to update schedule status", "error");
    }
  };

  // Open add schedule form
  const handleAddScheduleClick = () => {
    setFormMode("add");
    setSelectedSchedule(null);
    setIsScheduleFormOpen(true);
  };

  // Open edit schedule form
  const handleEditScheduleClick = (schedule) => {
    setFormMode("edit");
    setSelectedSchedule(schedule);
    setIsScheduleFormOpen(true);
  };

  // Handle schedule delete
  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await axios.delete(`${BASE}/barber/${barberId}/schedule/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Schedule deleted successfully.");
      fetchSchedules(barberId);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      showNotification("Failed to delete schedule", "error");
    }
  };

  // Handle generate slots
  const handleGenerateSlots = async (date) => {
    if (!date) return;
    if (slots && slots.length > 0) {
      showNotification("Slots for this date already exist. Generation rejected.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      await axios.post(
        `${BASE}/barber/${barberId}/slots/generate?date=${date}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Slots for ${date} generated successfully!`);
      // Trigger a refresh of the slots list
      setTargetDate("");
      setTimeout(() => setTargetDate(date), 0);
    } catch (error) {
      console.error("Error generating slots:", error);
      showNotification(
        error.response?.data?.message || "Failed to generate slots for selected date.",
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedule Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
        <h4 className="font-mono font-black text-sm uppercase tracking-wider text-black">
          Work Schedules & Slots
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddScheduleClick}
            className="inline-flex items-center gap-1.5 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all"
          >
            <Plus size={14} />
            <span>Add Schedule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedules Table */}
        <div className="lg:col-span-2 space-y-4">
          <ScheduleList
            schedules={schedules}
            onToggleActive={handleToggleScheduleActive}
            onEdit={handleEditScheduleClick}
            onDelete={handleDeleteSchedule}
          />
        </div>

        {/* Generate Slots Form Panel */}
        <div className="border-2 border-black bg-white p-4 h-fit">
          <div className="flex items-center gap-2 mb-3 border-b border-black/15 pb-2">
            <CalendarRange size={16} />
            <h5 className="font-mono font-bold text-xs uppercase tracking-wide">
              Generate Available Slots
            </h5>
          </div>
          <GenerateSlotForm
            date={targetDate}
            setDate={setTargetDate}
            onGenerate={handleGenerateSlots}
            isGenerating={isGenerating}
            slots={slots}
            isLoadingSlots={isLoadingSlots}
          />
        </div>
      </div>

      {/* Schedule Modal Form */}
      <ScheduleForm
        isOpen={isScheduleFormOpen}
        onClose={() => setIsScheduleFormOpen(false)}
        mode={formMode}
        schedule={selectedSchedule}
        existingSchedules={schedules}
        barberId={barberId}
        onSuccess={(msg) => {
          showNotification(msg);
          fetchSchedules(barberId);
        }}
        token={token}
        BASE={BASE}
      />
    </div>
  );
};

export default ScheduleSection;
