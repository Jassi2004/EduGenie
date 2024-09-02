import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Input, Divider, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
// import {Input} from "@nextui-org/react";
import {EyeFilledIcon} from "../assets/EyeFilledIcon";
import {EyeSlashFilledIcon} from "../assets/EyeSlashFilledIcon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(""); // For handling error messages
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      // Handle successful login, e.g., navigate to another page or show a success message
      const token = response.data.token; // Adjust according to your backend response
      localStorage.setItem("token", token);
      // console.log(response.data);
      navigate("/dashboard"); // Example redirection on successful login
    } catch (err) {
      // Handle error, e.g., show an error message
      console.error(err);
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card
        isFooterBlurred
        radius="lg"
        className="p-8 w-96 border-none shadow-lg bg-white"
      >
        <div className="flex flex-col items-center">
          {/* Login Button */}
          <Button
            color="primary"
            variant="light"
            className="w-full mb-4"
            onClick={handleLoginClick}
            disabled={loading} // Disable button while loading
          >
            Login to your account
          </Button>

          {/* Email Input */}
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            className="w-full mb-4 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          {/* <Input
            isRequired
            type="password"
            label="Password"
            placeholder="Enter your password"
            className="w-full mb-4"
            value={password}
            
          /> */}
            <Input
            isRequired
            label="Password"
            variant="bordered"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-xs mb-4"
          />

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Submit Button */}
          <Button
            color="primary"
            variant="solid"
            className="w-full mb-4"
            onClick={handleLoginClick}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Register Button */}
          <Button
            color="default"
            variant="flat"
            className="w-full mb-4"
            onClick={handleRegisterClick}
          >
            Register
          </Button>

          {/* Divider */}
          <Divider className="my-4" />

          {/* Social Login Buttons */}
          <Button color="secondary" variant="bordered" className="w-full mb-2">
            Login with Google
          </Button>
          <Button color="secondary" variant="bordered" className="w-full mb-4">
            Login with LinkedIn
          </Button>

          {/* Forgot Password Link */}
          <Link href="#" underline="hover" className="text-small">
            Forgot Password?
          </Link>
        </div>
      </Card>
    </div>
  );
}
