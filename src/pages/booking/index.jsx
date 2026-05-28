import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Star, Clock, Scissors, User, ChevronRight } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import useReveal from "../../hooks/useReveal";

const BASE = import.meta.env.VITE_BASE_URL;

// ─── helpers ────────────────────────────────────────────────────────────────
const addMinutes = (timeStr, minutes) => {
    if (!timeStr || minutes == null || isNaN(Number(minutes))) return "—";
    const parts = String(timeStr).split(":");
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const total = h * 60 + m + Number(minutes);
    const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}`;
};

const todayISO = () => new Date().toISOString().split("T")[0];

// ─── step indicator ──────────────────────────────────────────────────────────
const STEPS = ["Barber", "Service", "Schedule", "Confirm"];

const StepBar = ({ current }) => (
    <div className="flex items-center gap-0 w-full max-w-lg mx-auto mb-12">
        {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                    <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 font-mono text-xs
              ${i < current ? "bg-black border-black text-white"
                                : i === current ? "bg-white border-black text-black"
                                    : "bg-white border-black/20 text-black/30"}`}
                    >
                        {i < current ? <Check size={12} /> : i + 1}
                    </div>
                    <span className={`font-mono text-[10px] tracking-widest uppercase whitespace-nowrap
            ${i === current ? "text-black" : "text-black/30"}`}>
                        {label}
                    </span>
                </div>
                {i < STEPS.length - 1 && (
                    <div className={`h-px flex-1 mb-4 mx-1 transition-all duration-300
            ${i < current ? "bg-black" : "bg-black/15"}`} />
                )}
            </div>
        ))}
    </div>
);

// ─── step 1 — barber ─────────────────────────────────────────────────────────
const StepBarber = ({ selected, onSelect }) => {
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BASE}/barber`)
            .then(r => setBarbers(r.data.data.data.filter(b => b.is_active !== false)))
            .catch(() => setBarbers([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-black/5 animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbers.map(b => {
                const name = b.name ?? b.barber_name ?? "Barber";
                const rating = Number(b.rating ?? 0);
                const imageUrl = b.photo
                    ? `${BASE.replace("/api", "")}/${b.photo}`
                    : b.image ?? null;
                const isSelected = selected?.id === b.id;

                return (
                    <button
                        key={b.id}
                        onClick={() => onSelect(b)}
                        className={`group relative text-left border-2 overflow-hidden transition-all duration-200
              ${isSelected ? "border-black" : "border-black/10 hover:border-black/40"}`}
                    >
                        {/* photo */}
                        <div className="h-36 overflow-hidden bg-zinc-100">
                            {imageUrl
                                ? <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                : <div className="w-full h-full flex items-center justify-center"><User size={32} className="text-black/20" /></div>
                            }
                        </div>
                        {/* info */}
                        <div className="p-4 bg-white">
                            <p className="font-mono font-bold text-sm uppercase tracking-tight text-black">{name}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Star size={11} strokeWidth={1.5} className="text-black/50" />
                                <span className="font-mono text-[11px] text-black/50">{rating.toFixed(2)}</span>
                            </div>
                        </div>
                        {/* selected tick */}
                        {isSelected && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// ─── step 2 — service ─────────────────────────────────────────────────────────
const StepService = ({ selected, onSelect }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BASE}/services`)
            .then(r => setServices(r.data.data?.data ?? r.data.data ?? r.data))
            .catch(() => setServices([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-black/5 animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {services.map(s => {
                const isSelected = selected?.id === s.id;
                return (
                    <button
                        key={s.id}
                        onClick={() => onSelect(s)}
                        className={`w-full text-left border-2 p-5 transition-all duration-200 flex justify-between items-center gap-4
              ${isSelected ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/40"}`}
                    >
                        <div className="flex-1">
                            <p className={`font-mono font-bold text-sm uppercase tracking-tight ${isSelected ? "text-white" : "text-black"}`}>
                                {s.name ?? s.service_name}
                            </p>
                            {s.description && (
                                <p className={`font-mono text-[11px] mt-0.5 ${isSelected ? "text-white/60" : "text-black/40"}`}>
                                    {s.description}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`font-mono font-bold text-sm ${isSelected ? "text-white" : "text-black"}`}>
                                Rp {Number(s.price).toLocaleString("id-ID")}
                            </span>
                            <div className={`flex items-center gap-1 ${isSelected ? "text-white/60" : "text-black/40"}`}>
                                <Clock size={11} />
                                <span className="font-mono text-[11px]">{s.duration_minutes} min</span>
                            </div>
                        </div>
                        {isSelected && <Check size={16} className="text-white shrink-0" />}
                    </button>
                );
            })}
        </div>
    );
};

// ─── step 3 — schedule ────────────────────────────────────────────────────────
const StepSchedule = ({ barber, service, selectedSlot, onSelect }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(todayISO());
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        if (!barber?.id) return;
        setLoading(true);
        axios.get(`${BASE}/barber/${barber.id}/slots`, { params: { date, page } })
            .then(r => {
                // response: { data: { data: [...], last_page: N } }
                const pagination = r.data.data;
                setSlots(pagination.data ?? []);
                setLastPage(pagination.last_page ?? 1);
            })
            .catch(() => setSlots([]))
            .finally(() => setLoading(false));
    }, [barber, date, page]);

    // reset page when date/barber changes
    const handleDateChange = (e) => {
        setDate(e.target.value);
        setPage(1);
        onSelect(null);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* date picker */}
            <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-black/50 tracking-widest uppercase">Date</label>
                <input
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={handleDateChange}
                    className="border-b-2 text-black border-black/20 focus:border-black outline-none py-2 font-mono text-sm bg-transparent w-fit transition-colors duration-200"
                />
            </div>

            {/* slots grid */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-black/50 tracking-widest uppercase">
                        Available Slots
                    </p>
                    {lastPage > 1 && (
                        <p className="font-mono text-xs text-black/30">
                            Page {page} / {lastPage}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-10 bg-black/5 animate-pulse" />
                        ))}
                    </div>
                ) : slots.length === 0 ? (
                    <p className="font-mono text-sm text-black/30">No slots available for this date.</p>
                ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map(slot => {
                            const time = slot.start_time;
                            const isBooked = slot.status !== "available";
                            const isSelected = selectedSlot === time;

                            return (
                                <button
                                    key={slot.id}
                                    disabled={isBooked}
                                    onClick={() => onSelect(time)}
                                    className={`py-2 px-1 font-mono text-xs border-2 transition-all duration-150
                    ${isBooked
                                            ? "border-black/5 text-black/20 cursor-not-allowed bg-black/5"
                                            : isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-black/15 hover:border-black text-black"}`}
                                >
                                    {time.slice(0, 5)}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* pagination — di dalam konten, jauh dari tombol next step */}
                {lastPage > 1 && !loading && (
                    <div className="flex items-center gap-2 pt-2 border-t border-black/10 justify-center">
                        <div className="flex gap-1">
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 font-mono text-xs border transition-colors duration-150
                    ${p === page
                                            ? "bg-black text-white border-black"
                                            : "border-black/15 hover:border-black text-black"}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* end time preview */}
            {selectedSlot && service && (
                <div className="border border-black/10 p-4 bg-black/[0.02]">
                    <p className="font-mono text-xs text-black/50 tracking-widest uppercase mb-2">Session Preview</p>
                    <p className="font-mono text-sm text-black">
                        {selectedSlot.slice(0, 5)} → {addMinutes(selectedSlot.slice(0, 5), Number(service.duration_minutes))}
                        <span className="text-black/40 ml-2">({service.duration_minutes} min)</span>
                    </p>
                </div>
            )}
        </div>
    );
};

// ─── step 4 — confirm ─────────────────────────────────────────────────────────
const StepConfirm = ({ barber, service, slot, date, notes, onNotesChange }) => {
    const { user } = useContext(AuthContext);
    const barberName = barber?.name ?? barber?.barber_name ?? "—";
    const serviceName = service?.name ?? service?.service_name ?? "—";
    const endTime = slot && service ? addMinutes(slot.slice(0, 5), Number(service.duration_minutes)) : "—";

    const rows = [
        { label: "Barber", value: barberName },
        { label: "Service", value: serviceName },
        { label: "Date", value: date },
        { label: "Start", value: slot ?? "—" },
        { label: "End", value: endTime },
        { label: "Price", value: service ? `Rp ${Number(service.price).toLocaleString("id-ID")}` : "—" },
        { label: "Duration", value: service ? `${service.duration_minutes} min` : "—" },
        { label: "User", value: user?.name }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="border border-black/10">
                {rows.map((r, i) => (
                    <div key={r.label} className={`flex justify-between items-center px-5 py-3 font-mono text-sm
            ${i % 2 === 0 ? "bg-black/[0.02]" : "bg-white"}`}>
                        <span className="text-black/40 uppercase text-xs tracking-widest">{r.label}</span>
                        <span className="text-black font-medium">{r.value}</span>
                    </div>
                ))}
            </div>

            {/* notes */}
            <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-black/50 tracking-widest uppercase">
                    Notes <span className="normal-case">(optional)</span>
                </label>
                <textarea
                    value={notes}
                    onChange={e => onNotesChange(e.target.value)}
                    placeholder="Any special requests or notes for the barber..."
                    rows={4}
                    className="border-2 border-black/10 focus:border-black outline-none p-4 font-mono text-sm bg-transparent resize-none transition-colors duration-200 w-full"
                />
            </div>
        </div>
    );
};

// ─── main page ────────────────────────────────────────────────────────────────
const Booking = () => {
    useReveal();
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [barber, setBarber] = useState(null);
    const [service, setService] = useState(null);
    const [slot, setSlot] = useState(null);
    const [date, setDate] = useState(todayISO());
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const canNext = [
        !!barber,
        !!service,
        !!slot,
        true,
    ][step];

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(s => s + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(s => s - 1);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(
                `${BASE}/bookings`,
                {
                    user_id: user?.id,
                    barber_id: barber.id,
                    service_id: service.id,
                    booking_date: date,
                    start_time: slot.slice(0, 5),                                           // "09:20:00" → "09:20"
                    end_time: addMinutes(slot.slice(0, 5), Number(service.duration_minutes)),
                    notes: notes || undefined,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message ?? "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── success screen ──
    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Check size={28} className="text-white" />
                </div>
                <h1 className="font-mono font-black text-[32px] uppercase tracking-tight text-black">Booking Confirmed</h1>
                <p className="font-mono text-sm text-black/50 max-w-sm">
                    Your appointment with <strong className="text-black">{barber?.name}</strong> has been booked for <strong className="text-black">{date}</strong> at <strong className="text-black">{slot}</strong>.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="font-mono text-sm tracking-widest uppercase border-2 border-black px-10 py-3 bg-black hover:bg-white hover:text-black transition-colors duration-200"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-4 md:px-12 py-12">
            {/* back */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 font-mono text-xs text-black/40 hover:text-black tracking-widest uppercase mb-10 transition-colors duration-200"
            >
                <ArrowLeft size={14} /> Back to Home
            </button>

            {/* title */}
            <div className="mb-10 reveal">
                <h1 className="font-mono font-black text-[36px] md:text-[56px] uppercase leading-none text-black">
                    {STEPS[step]}
                </h1>
            </div>

            {/* step bar */}
            <StepBar current={step} />

            {/* step content */}
            <div className="max-w-3xl mx-auto reveal" style={{ transitionDelay: "100ms" }}>
                {step === 0 && <StepBarber selected={barber} onSelect={b => { setBarber(b); setSlot(null); }} />}
                {step === 1 && <StepService selected={service} onSelect={setService} />}
                {step === 2 && (
                    <StepSchedule
                        barber={barber}
                        service={service}
                        selectedSlot={slot}
                        onSelect={(s) => { setSlot(s); setDate(date); }}
                    />
                )}
                {step === 3 && (
                    <StepConfirm
                        barber={barber}
                        service={service}
                        slot={slot}
                        date={date}
                        notes={notes}
                        onNotesChange={setNotes}
                    />
                )}
            </div>

            {/* error */}
            {error && (
                <p className="font-mono text-xs text-red-500 text-center mt-6 max-w-3xl mx-auto">{error}</p>
            )}

            {/* nav buttons */}
            <div className="flex justify-between items-center max-w-3xl mx-auto mt-10">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className="flex items-center text-black gap-2 font-mono text-xs tracking-widest uppercase border-2 border-black px-6 py-3 hover:border-black transition-colors duration-200 disabled:invisible disabled:cursor-not-allowed"
                >
                    <ArrowLeft size={13} /> Back
                </button>

                {step < STEPS.length - 1 ? (
                    <button
                        onClick={handleNext}
                        disabled={!canNext}
                        className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase border-2 border-black bg-black text-white px-6 py-3 hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next <ArrowRight size={13} />
                    </button>
                ) : (
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase border-2 border-black bg-black text-white px-8 py-3 hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : <><Check size={13} /> Confirm Booking</>}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Booking;