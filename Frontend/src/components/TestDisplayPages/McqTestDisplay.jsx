import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Spinner,
} from "@nextui-org/react";
import QuestionCard from './QuestionCard'; // Extracted component for rendering a question
import ScoreCard from './ScoreCard'; // Extracted component for score display

const fetchQuizData = async () => {
  const response = await axios.get(`https://edugenie-1.onrender.com/api/get-test-data`);
  return response.data.data;
};

const updateTestResults = async (data) => {
  const response = await axios.patch(`https://edugenie-1.onrender.com/api/save-test-results`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const MCQTestPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null); // Use `null` to differentiate between "not submitted" and "submitted"
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const topic = location.state?.topic;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchQuizData();
        setQuizData(data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOptionSelect = (qId, option) => {
    if (score === null) { // Prevent changes after submission
      setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
    }
  };

  const calculateScore = () => {
    return quizData.reduce((acc, question) => {
      const selectedOption = selectedAnswers[question.qId];
      const selectedAnswerText = question[`option${selectedOption}`];
      return acc + (selectedAnswerText === question.answer ? 1 : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    const currentScore = calculateScore();
    setScore(currentScore);

    const payload = {
      score: currentScore,
      testType: 'mcq',
      topic,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await updateTestResults(payload);
      console.log(response.message);
    } catch (error) {
      console.error('Error updating test results:', error);
    }
  };

  const handleRetry = () => {
    setScore(null);
    setSelectedAnswers({});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">MCQ Test</h1>

      {score !== null && (
        <ScoreCard score={score} total={quizData.length} />
      )}

      {quizData.map((question, index) => (
        <QuestionCard
          key={question.qId}
          question={question}
          index={index}
          isSubmitted={score !== null}
          selectedOption={selectedAnswers[question.qId]}
          handleOptionSelect={handleOptionSelect}
        />
      ))}

      <div className="mt-6">
        {score === null ? (
          <Button color="primary" auto onClick={handleSubmit}>
            Submit Test
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button color="primary" auto onClick={handleRetry}>
              Retry This Test
            </Button>
            <Button
              color="secondary"
              auto
              onClick={() => window.location.href = '/generate-test'}
            >
              Generate New Test
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQTestPage;