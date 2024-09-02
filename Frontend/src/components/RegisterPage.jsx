import { useState } from "react";
import axios from "axios";
import { Card, Button, Input, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState(""); // New state for username
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); // For handling loading state
    const [error, setError] = useState(""); // For handling error messages

    const navigate = useNavigate();

    const handleRegisterClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("/api/register", {
                username,
                email,
                password
            });
            // Handle successful registration, e.g., navigate to another page or show a success message
            console.log(response.data);
            navigate("/login"); // Example redirection on successful registration
        } catch (err) {
            // Handle error, e.g., show an error message
            console.error(err);
            setError("Failed to register. Please try again.");
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
                    {/* Navigation to Login */}
                    <Button 
                        color="primary" 
                        variant="light" 
                        className="w-full mb-4" 
                        onClick={() => navigate("/login")}
                        disabled={loading}
                    >
                        Already have an account? Login
                    </Button>

                    {/* Username Input */}
                    <Input 
                        isRequired 
                        type="text" 
                        label="Username" 
                        placeholder="Enter your username" 
                        className="w-full mb-4" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Email Input */}
                    <Input 
                        isRequired 
                        type="email" 
                        label="Email" 
                        placeholder="Enter your email" 
                        className="w-full mb-4" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password Input */}
                    <Input 
                        isRequired 
                        type="password" 
                        label="Password" 
                        placeholder="Enter your password" 
                        className="w-full mb-4" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Confirm Password Input */}
                    <Input 
                        isRequired 
                        type="password" 
                        label="Confirm Password" 
                        placeholder="Confirm your password" 
                        className="w-full mb-4" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    

                    {/* Error Message */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Submit Button */}
                    <Button 
                        color="primary" 
                        variant="solid" 
                        className="w-full mb-4"
                        onClick={handleRegisterClick}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>

                    {/* Divider */}
                    <Divider className="my-4" />

                    {/* Social Register Buttons */}
                    <Button 
                        color="secondary" 
                        variant="bordered" 
                        className="w-full mb-2"
                    >
                        Register with Google
                    </Button>
                    <Button 
                        color="secondary" 
                        variant="bordered" 
                        className="w-full mb-4"
                    >
                        Register with LinkedIn
                    </Button>
                </div>
            </Card>
        </div>
    );
}
