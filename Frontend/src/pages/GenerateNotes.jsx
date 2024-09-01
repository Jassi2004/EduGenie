import { useState } from 'react';

const GenerateNotes = () => {
    const [topic, setTopic] = useState('');
    const [timeSetting, setTimeSetting] = useState('');
    const [complexity, setComplexity] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    if (!token) {
        setResponseMessage('Error: Token not found. Please log in again.');
        return;
    }
        try {
            const response = await fetch('http://localhost:5000/api/generate-notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token in the headers
                },
                body: JSON.stringify({ topic, timeSetting, complexity }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage(data.message);
                console.log('Response from backend:', data);
            } else {
                console.log('Failed to generate notes:', data);
                setResponseMessage('Failed to generate notes. Please try again.');
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setResponseMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <div className="generate-notes-container">
            <h1>Generate Study Notes</h1>
            <form onSubmit={handleSubmit} className="generate-notes-form">
                <div className="form-group">
                    <label htmlFor="topic">Topic to Study:</label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter the topic you want to study"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="time-setting">Time Available Before Exam:</label>
                    <select
                        id="time-setting"
                        value={timeSetting}
                        onChange={(e) => setTimeSetting(e.target.value)}
                        required
                    >
                        <option value="">Select time available</option>
                        <option value="3-hours">3 Hours</option>
                        <option value="1-day">1 Day</option>
                        <option value="complete-roadmap">Complete Roadmap</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="complexity">Complexity Level:</label>
                    <select
                        id="complexity"
                        value={complexity}
                        onChange={(e) => setComplexity(e.target.value)}
                        required
                    >
                        <option value="">Select complexity level</option>
                        <option value="baby">Baby</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">Generate Notes</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default GenerateNotes;
