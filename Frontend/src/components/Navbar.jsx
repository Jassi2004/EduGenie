import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [userDisplayName, setUserDisplayName] = useState('');

    useEffect(() => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Split the token to get the payload part (middle part)
                const base64Url = token.split('.')[1]; // JWT format: header.payload.signature
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

                // Decode the base64 string to a JSON string
                const decodedPayload = JSON.parse(atob(base64));

                console.log('Decoded payload:', decodedPayload); // For debugging

                // Use the email or any available field as the display name
                if (decodedPayload && decodedPayload.username) {
                    setUserDisplayName(decodedPayload.username); // Set the email as the display name
                }
            } catch (error) {
                console.error('Error decoding the token:', error);
            }
        }
    }, []);

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/">{userDisplayName ? `Welcome, ${userDisplayName}` : 'EduGenie'}</Link></li>
                {userDisplayName ? (
                    <li><Link to="/logout">Logout</Link></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
