import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Radio,
  RadioGroup,
  Progress,
  Spinner
} from "@nextui-org/react";

const MCQTestPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get topic from location state
  const location = useLocation();
  const topic = location.state?.topic; // Use optional chaining to avoid errors if topic is undefined

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-test-data');
        setQuizData(response.data.data); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleOptionSelect = (qId, option) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
    }
  };

  const handleSubmit = async () => {
    let currentScore = 0;

    // Calculate the score
    quizData.forEach(question => {
      const correctAnswerText = question.answer; // The text of the correct answer
      const selectedOption = selectedAnswers[question.qId]; // The letter of the selected option
      const selectedAnswerText = question[`option${selectedOption}`]; // Text of the selected option
      
      if (correctAnswerText === selectedAnswerText) {
        currentScore++;
      }
    }); 

    setScore(currentScore);
    setIsSubmitted(true);

    // Prepare data for the PATCH request to update the score
    const scoreUpdateData = {
      score: currentScore,
      testType: 'mcq',
      topic: `${topic}`,
      timestamp: new Date().toISOString() // Optional: Add a timestamp if needed
    };

    // PATCH request to update the test result
    try {
      const response = await axios.patch('http://localhost:5000/api/save-test-results', scoreUpdateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' // Ensure the content type is correct
        }
      });

      if (response.data.message === 'Test results updated successfully') {
        console.log('Test results updated successfully');
      } else {
        console.error('Error updating test results:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGenerateNewTest = () => {
    window.location.href = 'http://localhost:5173/generate-test';
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

      {isSubmitted && (
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500">
          <CardBody>
            <h2 className="text-2xl font-bold text-white mb-2">Your Score: {score} out of {quizData.length}</h2>
            <Progress
              value={(score / quizData.length) * 100}
              color="success"
              className="mt-2"
            />
          </CardBody>
        </Card>
      )}

      {quizData.map((question, index) => {
        const selectedOption = selectedAnswers[question.qId];
        const selectedAnswerText = question[`option${selectedOption}`];
        const isCorrect = selectedAnswerText === question.answer;
        const cardColorClass = isSubmitted ? (isCorrect ? 'bg-green-100' : 'bg-red-100') : '';
        const correctAnswerText = question.answer; // Text of the correct answer

        return (
          <Card key={question.qId} className={`mb-6 ${cardColorClass}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Question {index + 1}</p>
              <h4 className="font-bold text-large">{question.question}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <RadioGroup
                value={selectedOption || ''}
                onValueChange={(value) => handleOptionSelect(question.qId, value)}
                isDisabled={isSubmitted}
              >
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = question[`option${option}`];
                  const isOptionCorrect = optionText === question.answer;
                  const isSelected = selectedOption === option;
                  const optionColorClass = isSubmitted ? (isSelected && isOptionCorrect ? "text-green-500 font-bold" : "text-red-500") : "";

                  return (
                    <Radio
                      key={option}
                      value={option}
                      className={optionColorClass}
                    >
                      {optionText}
                      {isSubmitted && isSelected && isOptionCorrect && (
                        <span className="ml-2 text-green-500">✓</span>
                      )}
                    </Radio>
                  );
                })}
              </RadioGroup>
              {isSubmitted && (
                <div className="mt-2">
                  <p className={`font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  {!isCorrect && (
                    <p className="mt-1 text-sm text-green-500">Correct Answer: {correctAnswerText}</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}

      {!isSubmitted ? (
        <Button
          color="primary"
          auto
          onClick={handleSubmit}
        >
          Submit Test
        </Button>
      ) : (
        <div className="flex gap-4 mt-6">
          <Button
            color="primary"
            auto
            onClick={handleRetry}
          >
            Retry This Test
          </Button>
          <Button
            color="secondary"
            auto
            onClick={handleGenerateNewTest}
          >
            Generate New Test
          </Button>
        </div>
      )}
    </div>
  );
};

export default MCQTestPage;
