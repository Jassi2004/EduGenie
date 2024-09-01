import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // Check the response status
            if (!response.ok) {
                // Response is not OK, log the status code and status text
                console.log(`Error: ${response.status} - ${response.statusText}`);
                const data = await response.json();
                alert(`Error occurred: ${data.message}`);
                return;
            }

            // Parse the response data
            const data = await response.json();
            console.log("Data from backend:", data);

            if (data && data.token) {
                console.log('Login successful, navigating to dashboard...');
                localStorage.setItem('token', data.token); // Store the token
                navigate('/dashboard'); // Navigate to the dashboard
            } else {
                alert('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
            console.log('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Dont have an account? <a href="/signup">Sign up here</a>
            </p>
        </div>
    );
};

export default Login;
