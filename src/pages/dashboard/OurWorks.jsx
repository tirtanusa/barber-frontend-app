import { useState, useEffect, useRef } from "react";

const worksData = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=500&q=80",
        alt: "Classic Scissors Haircut",
        title: "Classic Scissor Cut",
        description: "Traditional shear work tailoring clean contours and classic texture.",
        className: "top-[8%] left-[17%] w-[120px] md:w-[150px] aspect-[4/5] z-0 opacity-40",
        rot: "-18deg",
        floatClass: "animate-float-1",
        depth: 0.12,
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1527799881375-d558b1bfb824?auto=format&fit=crop&w=500&q=80",
        alt: "Barbershop Vintage Chair",
        title: "Vintage Parlor Space",
        description: "Our dedicated styling stations equipped with classic leather barbershop chairs.",
        className: "top-[2%] right-[25%] w-[110px] md:w-[130px] aspect-[1/1] z-0 opacity-30",
        rot: "20deg",
        floatClass: "animate-float-2",
        depth: 0.08,
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=500&q=80",
        alt: "Barber Grooming Detail",
        title: "Grooming & Hair Styling",
        description: "Precision clipper-over-comb techniques detailing custom styles.",
        className: "top-[10%] left-[37%] w-[160px] md:w-[190px] aspect-[4/3] z-5 opacity-50",
        rot: "12deg",
        floatClass: "animate-float-3",
        depth: 0.18,
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80",
        alt: "High Razor Fade Cut",
        title: "High Skin Fade",
        description: "A clean high fade blended down to the skin for a sharp modern aesthetic.",
        className: "top-[38%] left-[7%] w-[170px] md:w-[200px] aspect-[4/5] z-10 opacity-70",
        rot: "-14deg",
        floatClass: "animate-float-4",
        depth: 0.22,
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1605497746444-ac9dbd340b68?auto=format&fit=crop&w=500&q=80",
        alt: "Beard Shave & Trim",
        title: "Precision Beard Sculpting",
        description: "Full service beard shaping, detailing, and hot towel finish.",
        className: "top-[46%] left-[23%] w-[190px] md:w-[220px] aspect-[3/4] z-25 opacity-90",
        rot: "6deg",
        floatClass: "animate-float-1",
        depth: 0.28,
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=500&q=80",
        alt: "Modern Mid Fade Cut",
        title: "Textured Mid Fade",
        description: "Balanced mid fade styling paired with structured pompadour styling.",
        className: "top-[32%] left-[40%] w-[210px] md:w-[260px] aspect-[1/1] z-30 opacity-100",
        rot: "-6deg",
        floatClass: "animate-float-2",
        depth: 0.45,
    },
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80",
        alt: "Classic Barber Styling",
        title: "Modern Pompadour",
        description: "Bold volume styling combined with clean razor sharp lines.",
        className: "top-[30%] right-[18%] w-[200px] md:w-[240px] aspect-[3/4] z-25 opacity-95",
        rot: "10deg",
        floatClass: "animate-float-3",
        depth: 0.38,
    },
    {
        id: 8,
        src: "https://images.unsplash.com/photo-1534774592507-488885376ad3?auto=format&fit=crop&w=500&q=80",
        alt: "Grooming Session Detail",
        title: "Taper & Edge Line-up",
        description: "Detailed line work with razor finishes around the sideburns and neckline.",
        className: "top-[50%] right-[6%] w-[160px] md:w-[190px] aspect-[4/3] z-10 opacity-60",
        rot: "-15deg",
        floatClass: "animate-float-4",
        depth: 0.24,
    },
    {
        id: 9,
        src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=500&q=80",
        alt: "Barber Shop Interior",
        title: "Our Barber Shop Vibe",
        description: "Welcoming spaces combining raw textures with premium grooming stations.",
        className: "bottom-[8%] left-[18%] w-[170px] md:w-[200px] aspect-[1/1] z-10 opacity-75",
        rot: "-10deg",
        floatClass: "animate-float-1",
        depth: 0.32,
    },
    {
        id: 10,
        src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=500&q=80",
        alt: "Barber Cutting Details",
        title: "Buzz Cut & Bleach",
        description: "Bold styling incorporating clean buzz cuts and custom coloring.",
        className: "bottom-[5%] left-[45%] w-[180px] md:w-[210px] aspect-[3/4] z-15 opacity-85",
        rot: "12deg",
        floatClass: "animate-float-2",
        depth: 0.35,
    },
    {
        id: 11,
        src: "https://images.unsplash.com/photo-1517832606589-7a598b389576?auto=format&fit=crop&w=500&q=80",
        alt: "Barber Clipper Work",
        title: "Clipper Outlining",
        description: "Crisp straight razor neck shaves to complete the ultimate grooming experience.",
        className: "bottom-[12%] right-[15%] w-[110px] md:w-[130px] aspect-[4/3] z-5 opacity-40",
        rot: "8deg",
        floatClass: "animate-float-3",
        depth: 0.15,
    },
];

const OurWorks = () => {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isIntersecting, setIsIntersecting] = useState(false);

    // Intersection Observer to trigger entrance animation when scrolled into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Normalize coordinates relative to container center (-0.5 to 0.5)
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        setMousePos({ x: relX, y: relY });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    return (
        <section className="relative w-full bg-transparent select-none">

            {/* Desktop Collage Layout (md and above) */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="hidden md:block relative w-full h-[800px]"
            >
                {/* Underlay Grid Lines or Subtle Textures if needed, matching premium raw style */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-white/80 pointer-events-none z-10" />

                {/* Scattered Photo Collage */}
                {worksData.map((img, idx) => {
                    // Calculate movement multiplier based on image depth and mouse coordinates
                    const maxTranslation = 50; // max shift in pixels
                    const transX = mousePos.x * maxTranslation * img.depth;
                    const transY = mousePos.y * maxTranslation * img.depth;

                    return (
                        <div
                            key={img.id}
                            className={`absolute ${img.className}  bg-transparent transition-transform duration-300 ease-out`}
                            style={{
                                transform: `translate3d(${transX}px, ${transY}px, 0)`,
                                opacity: isIntersecting ? undefined : 0,
                                animationDelay: `${idx * 70}ms`,
                            }}
                        >
                            <div
                                className={`${isIntersecting ? 'animate-scaleUp' : ''} ${img.floatClass} w-full h-full`}
                                style={{
                                    '--rot': img.rot,
                                    animationDelay: `${idx * 120}ms`,
                                }}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover filter grayscale"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Central Overlay Title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
                    <h2 className="font-bebasNeue text-[11vw] tracking-wider leading-[0.85] text-center select-none flex flex-col items-center justify-center">
                        <span className="text-outline-gold drop-shadow-sm">OUR</span>
                        <span className="text-outline-gold drop-shadow-sm">WORKS</span>
                    </h2>
                </div>
            </div>

            {/* Mobile Swipeable Slider Layout (sm screens) */}
            <div className="block md:hidden py-16 px-6 bg-transparent">
                <div className="text-center mb-8">
                    <h2 className="font-bebasNeue text-[72px] tracking-wider leading-[0.9] text-center select-none flex flex-col items-center">
                        <span className="text-outline-gold">OUR</span>
                        <span className="text-outline-gold">WORKS</span>
                    </h2>
                </div>

                {/* Mobile Horizontal Carousel */}
                <div className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-6">
                    {worksData.map((img) => (
                        <div
                            key={img.id}
                            className="min-w-[75%] max-w-[280px] snap-center aspect-[3/4] bg-neutral border border-black/10 overflow-hidden shadow-lg flex-shrink-0 rounded-sm"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover filter grayscale"
                            />
                        </div>
                    ))}
                </div>

                {/* Directions info */}
                <div className="flex flex-col items-center gap-4 mt-6">
                    <p className="font-mono text-[12px] text-black/40">
                        ← Swipe to explore →
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OurWorks;
