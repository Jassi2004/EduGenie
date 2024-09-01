import { useState } from "react";

const GenerateTests = () => {
  const [testType, setTestType] = useState("");
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    if (!token) {
        setResponseMessage('Error: Token not found. Please log in again.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/generate-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
            body: JSON.stringify({ testType, topic, numberOfQuestions }),
        });

        const data = await response.json();

        if (response.ok) {
            setResponseMessage(data.message);
            console.log('Response from backend:', data);
        } else {
            console.log('Failed to generate test:', data);
            setResponseMessage('Failed to generate test. Please try again.');
        }
    } catch (error) {
        console.log('Error submitting form:', error);
        setResponseMessage('Error connecting to the server. Please try again.');
    }
};


  return (
    <div className="generate-test-container">
      <h1>Generate Test</h1>
      <form onSubmit={handleSubmit} className="generate-test-form">
      <div className="form-group">
    <label>Type of Test:</label>
    <div className="button-group">
        <button 
            type="button" 
            className={`test-type-button ${testType === 'mcq' ? 'selected' : ''}`}
            onClick={() => setTestType('mcq')}
        >
            MCQ
        </button>
        <button 
            type="button" 
            className={`test-type-button ${testType === 'fill-in-the-blanks' ? 'selected' : ''}`}
            onClick={() => setTestType('fill-in-the-blanks')}
        >
            Fill in the Blanks
        </button>
        <button 
            type="button" 
            className={`test-type-button ${testType === 'question-answers' ? 'selected' : ''}`}
            onClick={() => setTestType('question-answers')}
        >
            Question & Answers
        </button>
    </div>
</div>


        <div className="form-group">
          <label htmlFor="topic">Topic You Want To Test:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the topic for the test"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="number-of-questions">Number of Questions:</label>
          <input
            type="number"
            id="number-of-questions"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(e.target.value)}
            placeholder="Enter number of questions"
            min="1"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Generate Test
        </button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default GenerateTests;
