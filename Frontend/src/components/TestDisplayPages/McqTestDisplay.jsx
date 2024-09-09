import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-test-data');
        setQuizData(response.data.testData);
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
      if (selectedAnswers[question.qId] === question.answer) {
        currentScore++;
      }
    });
  
    setScore(currentScore);
    setIsSubmitted(true);
  
    // Prepare data to send to the backend
    const testResultData = {
      userId: '66d721c657d6ff6e9e73f714', // Replace with the actual user ID
      testId: '66dd68ef6fcef28e123db435', // Replace with the actual test ID
      score: currentScore,
      testType: 'mcq', // Adjust based on your data
      topic: 'linux',  // Adjust based on your data
      numberOfQuestions: quizData.length
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/submit-test', testResultData);
  
      if (response.data.message === 'Test submitted successfully') {
        console.log('Test results saved successfully');
      } else {
        console.error('Error saving test results:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting test results:', error);
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
        const isCorrect = selectedAnswers[question.qId] === question.answer;
        const cardColorClass = isSubmitted ? (isCorrect ? 'bg-green-100' : 'bg-red-100') : '';
        const correctAnswerText = question[question.answer]; // Get the correct answer text

        return (
          <Card key={question.qId} className={`mb-6 ${cardColorClass}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Question {index + 1}</p>
              <h4 className="font-bold text-large">{question.question}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <RadioGroup
                value={selectedAnswers[question.qId] || ''}
                onValueChange={(value) => handleOptionSelect(question.qId, value)}
                isDisabled={isSubmitted}
              >
                {['A', 'B', 'C', 'D'].map((option) => (
                  <Radio
                    key={option}
                    value={`option${option}`}
                    className={isSubmitted && `option${option}` === question.answer ? "text-green-500 font-bold" : ""}
                  >
                    {question[`option${option}`]}
                    {isSubmitted && `option${option}` === question.answer && (
                      <span className="ml-2 text-green-500">✓</span>
                    )}
                  </Radio>
                ))}
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
