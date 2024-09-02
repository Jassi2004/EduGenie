import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from 'buffer';
import logo from '../assets/image.png'; // Import the logo image

const defaultAvatar = 'https://images.unsplash.com/broken'; // Default avatar URL

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(defaultAvatar); // Default to defaultAvatar
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        const decoded = JSON.parse(jsonPayload);

        console.log("Decoded: ", decoded);
        setUsername(decoded.username);
        if (decoded.avatar) {
          setAvatar(decoded.avatar); // Use provided avatar if available
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        // Handle token decoding errors if necessary
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setAvatar(defaultAvatar); // Reset to default avatar on logout
    navigate("/login"); // Redirect to login page or homepage
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <img src={logo} alt="EduGenie Logo" className="h-10 w-auto" /> {/* Replace text with image */}
      <div className="flex items-center space-x-4">   
        {username ? (
          <>
            <img
              src={avatar} // Display user's avatar or default
              alt={username}
              className="h-10 w-10 rounded-full border border-gray-400"
            />
            <span>Welcome, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
