const ServiceTable = ({ services = [] }) => {
  const formatDuration = (minutes) => {
    if (!minutes) return "-";
    return `${minutes} min`;
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "-";
    const num = Number(price);
    if (num >= 1000) return `${Math.round(num / 1000)}k`;
    return `${num}`;
  };

  const isEmpty = services.length === 0;

  return (
    <div className="mx-4 sm:mx-10 md:mx-20">
      {/* Header Row */}
      <div className="grid grid-cols-[30px_1fr_80px_60px] md:grid-cols-[60px_1fr_140px_100px] px-2 md:px-4 pb-3 border-b border-black/20">
        <span className="font-azeretMono text-[11px] md:text-[13px] text-black font-bold tracking-wider">
          No
        </span>
        <span className="font-azeretMono text-[11px] md:text-[13px] text-black font-bold tracking-wider">
          Service
        </span>
        <span className="font-azeretMono text-[11px] md:text-[13px] text-black font-bold tracking-wider">
          Duration
        </span>
        <span className="font-azeretMono text-[11px] md:text-[13px] text-black font-bold tracking-wider text-right">
          Price
        </span>
      </div>

      {/* Skeleton loading */}
      {isEmpty &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[30px_1fr_80px_60px] md:grid-cols-[60px_1fr_140px_100px] px-2 md:px-4 py-3 md:py-4 border-b border-black/10"
          >
            <div className="h-4 w-5 bg-black/10 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-black/10 rounded animate-pulse" />
            <div className="h-4 w-12 bg-black/10 rounded animate-pulse" />
            <div className="h-4 w-8 bg-black/10 rounded animate-pulse ml-auto" />
          </div>
        ))}

      {/* Rows */}
      {services.map((s, i) => (
        <div
          key={s.id ?? i}
          className="grid grid-cols-[30px_1fr_80px_60px] md:grid-cols-[60px_1fr_140px_100px] px-2 md:px-4 py-3 md:py-4 border-b border-black/10 hover:bg-black/5 transition-colors duration-150 group"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="font-mono text-[12px] md:text-[14px] text-black">
            {i + 1}
          </span>
          <span className="font-mono text-[13px] md:text-[15px] text-black font-medium tracking-tight">
            {s.service_name ?? s.name ?? "-"}
          </span>
          <span className="font-mono text-[12px] md:text-[14px] text-black">
            {formatDuration(s.duration_minutes)}
          </span>
          <span className="font-mono text-[13px] md:text-[15px] text-black text-right">
            {formatPrice(s.price)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ServiceTable;
