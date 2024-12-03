// src/components/MainLayout.jsx
// import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust the import path as necessary

const MainLayout = () => {
    const location = useLocation();

    // Determine if the current route is login or register
    const showNavbar = !["/login", "/register"].includes(location.pathname);

    return (
        <div>
            {showNavbar && <Navbar />}
            <main className="p-14">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
