// src/components/SplashScreen.jsx
import React, { useState, useEffect } from "react";
import lampImage from '../assets/lamp.png'; // Your lamp image
import genieImage from '../assets/genie.png'; // Your genie image (could be a simple figure or a graphic)

const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 1500); // Show splash for 4 seconds
        return () => clearTimeout(timer);
    }, []);

    if (!showSplash) return null;

    return (
        <div className="splash-screen">
            <div className="lamp-container">
                <img src={lampImage} alt="Lamp" className="lamp-image" />
                <img src={genieImage} alt="Genie" className="genie-image" />
            </div>
        </div>
    );
};

export default SplashScreen;
