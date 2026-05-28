import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// Skala font berdasarkan panjang kata terpanjang di nama
const getNameFontSize = (name) => {
  const longest = Math.max(...name.split(" ").map((w) => w.length));
  if (longest <= 6) return { mobile: "28px", desktop: "84px" };
  if (longest <= 9) return { mobile: "24px", desktop: "72px" };
  if (longest <= 12) return { mobile: "20px", desktop: "56px" };
  return { mobile: "16px", desktop: "40px" };
};

const BarberCard = ({ barbers = [] }) => {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((i) => (i - 1 + barbers.length) % barbers.length);
  const next = () =>
    setIndex((i) => (i + 1) % barbers.length);

  const barber = barbers[index];

  // Placeholder tampilan saat data belum ada
  if (!barber) {
    return (
      <div className="bg-neutral w-full px-6 py-8">
        <h2 className="text-white font-black text-[32px] md:text-[96px] leading-none mb-6 text-center md:text-right">
          THE ARTIST
        </h2>
        <div className="flex flex-col md:flex-row w-full gap-8 md:gap-6 items-center md:items-end">
          <div className="flex flex-col items-end gap-2 min-w-[120px]">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 w-48 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
          <div className="w-full max-w-[280px] shrink-0 aspect-[3/4] bg-zinc-700 animate-pulse" />
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const name = barber.name ?? barber.barber_name ?? "BARBER";
  const description = barber.description ?? barber.bio ?? "Professional barber";
  const rating = Number(barber.rating ?? 0);
  const reviews = barber.reviews ?? barber.total_reviews ?? 0;
  const imageUrl = barber.photo
    ? `${import.meta.env.VITE_BASE_URL.replace("/api", "")}/${barber.photo}`
    : barber.image ?? null;

  return (
    <div className="bg-neutral w-full px-6 py-8">
      {/* Section label */}
      <h2 className="text-white font-black text-[32px] md:text-[96px] leading-none mb-6 text-center md:text-right">
        THE ARTIST
      </h2>

      {/* Main row: Name (kiri) | Photo (tengah) | Info (kanan) */}
      <div className="flex flex-col md:flex-row w-full gap-8 md:gap-6 items-center md:items-end">

        {/* Nama barber — kiri, fixed width agar tidak mendorong kolom lain */}
        {(() => {
          const fs = getNameFontSize(name);
          return (
            <div className="flex flex-row md:flex-col flex-wrap md:flex-nowrap justify-center md:justify-end gap-x-3 md:gap-0 md:w-[260px] shrink-0">
              {name.split(" ").map((word, i) => (
                <h1
                  key={i}
                  style={{
                    fontSize: `clamp(${fs.mobile}, 5vw, ${fs.desktop})`,
                    lineHeight: 1.05,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                  className="text-white font-black text-center md:text-right uppercase"
                >
                  {word}
                </h1>
              ))}
            </div>
          );
        })()}

        {/* Photo — portrait */}
        <div className="w-full max-w-[280px] shrink-0 aspect-[3/4] border-2 border-white/20 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
              <span className="text-white/30 font-mono text-sm">No Photo</span>
            </div>
          )}
        </div>

        {/* Info — kanan */}
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start gap-4 py-2 text-center md:text-left">
          {/* Description */}
          <p className="font-mono text-white text-[13px] leading-relaxed max-w-[400px] md:max-w-none">
            {description}
          </p>

          {/* Divider */}
          <div className="w-full md:w-px h-px md:h-8 bg-white/30 my-1 md:my-0" />

          {/* Rating */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Star size={14} className="text-white" strokeWidth={1.5} />
            <span className="font-mono text-white text-[13px]">
              {rating.toFixed(2)}
            </span>
          </div>

          {/* Barber index indicator */}
          {barbers.length > 1 && (
            <span className="font-mono text-white/40 text-[11px]">
              {index + 1} / {barbers.length}
            </span>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full max-w-[280px] md:max-w-none">
            <button className="font-mono text-white border border-white rounded-full py-2 text-[13px] hover:bg-white hover:text-black transition-colors duration-200 flex-1">
              Book
            </button>

            {/* Prev / Next cycling */}
            {barbers.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous barber"
                  className="border border-white rounded-full w-10 h-10 shrink-0 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
                >
                  <ChevronLeft size={16} className="text-white group-hover:text-black" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next barber"
                  className="border border-white rounded-full w-10 h-10 shrink-0 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
                >
                  <ChevronRight size={16} className="text-white group-hover:text-black" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberCard;
