import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { LogOut, User, Home, Zap, CreditCard } from "lucide-react";
import { useUser } from '../contexts/UserContext';
import axios from "axios";

const FuturisticNavbar = () => {
  const {
    username,
    avatar,
    userPlan,
    generationsLeft,
    remainingDays,
    isPremium,
    fetchUserDetails,
  } = useUser();

  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(true);

  // Fetch user details only once when the component mounts
  useEffect(() => {
    console.log(userPlan);

    if (!username) {
      fetchUserDetails();
    }
  }, [username, fetchUserDetails]);  // Ensuring it only runs once after the username is available

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getPlanColor = () => {
    switch (userPlan) {
      case "weekly":
        return "success";
      case "monthly":
        return "primary";
      default:
        return "warning";
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 p-4 bg-transparent text-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(true)}
    >
      {/* Holographic Background Effect */}
      <div
        className={`
          absolute inset-0 
          bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10
          backdrop-blur-xl 
          transition-all duration-700 ease-in-out
          ${isHovered ? "opacity-100 scale-[1.02]" : "opacity-70"}
        `}
      >
        {/* Animated Particle Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-300/30 rounded-full animate-float"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navbar Content */}
      <div className="relative z-10 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group">
          <span
            className="
              text-4xl font-bold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-cyan-500 to-blue-600
              transition-all duration-500 
              group-hover:tracking-wider
            "
          >
            EduGenie
          </span>
        </Link>

        {username ? (
          <div className="flex items-center space-x-8">
            {/* Generations Left Indicator */}
            <div>
              <Chip color={getPlanColor()} variant="flat" className="mr-2">
                {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
              </Chip>
              <Chip color="default" variant="bordered" className="mr-2">
                {generationsLeft} Generations Left
              </Chip>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-5">
              <button
                onClick={() => navigate("/payments")}
                className="
                  px-4 py-2 
                  bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white 
                  rounded-full 
                  hover:from-purple-600 hover:to-pink-600 
                  transition-all duration-300 
                  flex items-center space-x-2
                "
              >
                <CreditCard className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              <Link
                to="/dashboard"
                className="
                  flex items-center space-x-2 
                  transition-all duration-300 
                  hover:scale-105 text-black
                "
              >
                <Home className="w-8 h-8" />
              </Link>

              {/* User Dropdown */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform hover:scale-110"
                    color="primary"
                    size="sm"
                    src={avatar}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User Actions"
                  variant="faded"
                  className="bg-white/10 backdrop-blur-lg"
                >
                  <DropdownItem
                    key="profile"
                    startContent={<User className="mr-2" />}
                    onClick={() => navigate("/userDashboard")}
                    className="text-black hover:bg-blue-500/20"
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<LogOut className="mr-2" />}
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="
                px-4 py-2 
                border border-cyan-500
                text-cyan-600 
                rounded-full 
                hover:bg-cyan-500/20 
                transition-all duration-300 
                flex items-center space-x-2
              "
            >
              <Zap className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate("/register")}
              className="
                px-4 py-2 
                bg-gradient-to-r from-cyan-500 to-blue-600 
                text-white 
                rounded-full 
                hover:from-cyan-600 hover:to-blue-700 
                transition-all duration-300 
                flex items-center space-x-2
              "
            >
              <Zap className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>

      {/* Futuristic Accent Line */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-[2px] 
          bg-gradient-to-r from-transparent via-cyan-500 
          to-transparent opacity-50
          transition-all duration-500
          ${isHovered ? "scale-x-110" : ""}
        `}
      />
    </nav>
  );
};

export default FuturisticNavbar;
