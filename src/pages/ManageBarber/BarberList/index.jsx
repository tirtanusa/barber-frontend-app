import React from "react";
import BarberCard from "./BarberCard";

const BarberList = ({
  barbers,
  isLoading,
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
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-black">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent mb-4"></div>
        <span className="font-mono text-sm uppercase tracking-widest text-black/60 font-bold">
          Loading Barbers List...
        </span>
      </div>
    );
  }

  if (barbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-black">
        <span className="font-mono text-sm uppercase tracking-widest text-black/40 font-bold">
          No Barbers Found
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {barbers.map((barber) => (
        <BarberCard
          key={barber.id}
          barber={barber}
          onToggleActive={onToggleActive}
          onEdit={onEdit}
          onDelete={onDelete}
          schedules={schedules}
          fetchSchedules={fetchSchedules}
          setSchedules={setSchedules}
          showNotification={showNotification}
          token={token}
          BASE={BASE}
        />
      ))}
    </div>
  );
};

export default BarberList;
