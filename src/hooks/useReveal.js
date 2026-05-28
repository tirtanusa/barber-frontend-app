// src/hooks/useReveal.js
import { useEffect } from "react";

const useReveal = () => {
    useEffect(() => {
        const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

export default useReveal;