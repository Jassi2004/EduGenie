import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/users/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    // If the token is invalid or expired, redirect to login
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.log('Error fetching dashboard data:', error);
                navigate('/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Welcome to the Dashboard, {userData.id}!</h1>
            <p>This is the main page of the website.</p>
            <div className="button-container">
                <button className="dashboard-button" onClick={() => navigate('/generate-notes')}>Generate Notes</button>
                <button className="dashboard-button" onClick={() => navigate('/generate-tests')}>Generate Tests</button>
                <button className="dashboard-button" onClick={() => navigate('/publish-notes')}>Publish Notes</button>
            </div>
        </div>
    );
};

export default Dashboard;
