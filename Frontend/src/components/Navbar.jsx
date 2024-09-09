import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { Buffer } from 'buffer';
import { Tooltip, Button } from '@nextui-org/react'; // Import Tooltip and Button from NextUI
import logo from '../assets/image.png'; // Import the logo image

const defaultAvatar = 'https://media.istockphoto.com/id/619400810/photo/mr-who.jpg?s=2048x2048&w=is&k=20&c=ajUh75eNfNRDL0M0pcCOfq82dlak8mKavlAKgNbMgl4='; // Default avatar URL

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

  const handleLogout = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the Link
    localStorage.removeItem("token");
    setUsername(null);
    setAvatar(defaultAvatar); // Reset to default avatar on logout
    navigate("/login"); // Redirect to login page or homepage
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <img src={logo} alt="EduGenie Logo" className="h-10 w-auto" /> {/* Replace text with image */}
      <Tooltip content="Redirects to Dashboard" placement="bottom">
        <Link 
          to="/userDashboard"
          className="flex items-center space-x-4"
        >
          {username ? (
            <>
              <img
                src={avatar} // Display user's avatar or default
                alt={username}
                className="h-10 w-10 rounded-full border border-gray-400"
              />
              <span>{username}</span>
              <Button 
                auto 
                color="primary"
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                auto 
                color="primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from bubbling up to the Link
                  navigate("/login");
                }}
                className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Login
              </Button>
              <Button 
                auto 
                color="success"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from bubbling up to the Link
                  navigate("/register");
                }}
                className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
              >
                Sign Up
              </Button>
            </>
          )}
        </Link>
      </Tooltip>
    </nav>
  );
};

export default Navbar;
