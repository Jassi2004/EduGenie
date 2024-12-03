import { createContext, useState, useContext, useEffect } from 'react';
import { Buffer } from "buffer";
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [avatar, setAvatar] = useState(
        "https://media.istockphoto.com/id/619400810/photo/mr-who.jpg?s=2048x2048&w=is&k=20&c=ajUh75eNfNRDL0M0pcCOfq82dlak8mKavlAKgNbMgl4="
    );
    const [userPlan, setUserPlan] = useState("free");
    const [generationsLeft, setGenerationsLeft] = useState(0);
    const [remainingDays, setRemainingDays] = useState(null);
    const [isPremium, setIsPremium] = useState(false);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Decode token for basic details
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
                const decoded = JSON.parse(jsonPayload);

                // Fetch remaining generations from API
                const response = await axios.get(
                    "http://localhost:5000/api/get-user-details",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("decoded: ", response.data);
                setUsername(response.data.username);
                setUserPlan(response.data.planType || "free");
                setAvatar(response.data.avatar || avatar);
                setGenerationsLeft(response.data.generationsLeft || 0);
                setRemainingDays(response.data.remainingDays || null);
                setIsPremium(response.data.isPremium || false);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);  // Empty array to ensure this effect runs only once on component mount

    return (
        <UserContext.Provider
            value={{
                username,
                avatar,
                userPlan,
                generationsLeft,
                remainingDays,
                isPremium,
                fetchUserDetails
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
