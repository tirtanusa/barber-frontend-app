import React from "react";
import { Sparkles } from "lucide-react";

const GenerateSlotForm = ({ date, setDate, onGenerate, isGenerating, slots, isLoadingSlots }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    onGenerate(date);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
            Target Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-black p-2.5 font-mono text-xs focus:outline-none focus:bg-gray-50 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !date || (slots && slots.length > 0)}
          className="w-full inline-flex items-center justify-center gap-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none disabled:opacity-50"
        >
          <Sparkles size={14} />
          <span>{isGenerating ? "Generating..." : "Generate Slots"}</span>
        </button>
      </form>

      {/* Slots Display */}
      {date && (
        <div className="mt-4 border-t-2 border-black/10 pt-4">
          <h6 className="font-mono text-[10px] font-bold uppercase tracking-widest mb-3">
            Existing Slots
          </h6>
          {isLoadingSlots ? (
            <div className="text-xs font-mono text-black/50">Loading slots...</div>
          ) : slots && slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`border-2 border-black p-1 text-center font-mono text-[10px] ${
                    slot.is_booked ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                  }`}
                  title={slot.is_booked ? "Booked" : "Available"}
                >
                  {slot.start_time.slice(0, 5)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs font-mono text-black/50 italic">
              No slots generated for this date.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateSlotForm;
