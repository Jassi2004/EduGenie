// src/components/Parallax.jsx
import React, { useState, useEffect } from "react";

const Parallax = ({ children, speed }) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setOffset(scrollPosition * speed); // Adjust speed for the parallax effect
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [speed]);

    return (
        <div
            style={{
                transform: `translateY(${offset}px)`,
                transition: "transform 0.1s ease-out",
            }}
        >
            {children}
        </div>
    );
};

export default Parallax;
