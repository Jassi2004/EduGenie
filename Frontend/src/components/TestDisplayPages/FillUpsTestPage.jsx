import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Progress,
  Spinner,
  AccordionItem,
  Accordion
} from "@nextui-org/react";

const FillUpsTestPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('https://edugenie-1.onrender.com/api/get-test-data');
        setQuizData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleInputChange = (qId, value) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({ ...prev, [qId]: value }));
    }
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    quizData.forEach(question => {
      if (selectedAnswers[question.qId]?.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);

    // Save the test results to the backend
    try {
      const response = await axios.patch('https://edugenie-1.onrender.com/api/save-test-results', {
        score: currentScore,
        timestamp: new Date().toISOString(),
        testType: 'fill-in-the-blanks', // Make sure this matches the test type used
        topic: 'Your Topic Here' // Make sure this matches the topic used
      });
      console.log('Test results saved:', response.data);
    } catch (error) {
      console.error('Error saving test results:', error);
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
      <h1 className="text-3xl font-bold mb-6">Fill-in-the-Blanks Test</h1>

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
        const isCorrect = selectedAnswers[question.qId]?.trim().toLowerCase() === question.answer.trim().toLowerCase();
        const inputColorClass = isSubmitted ? (isCorrect ? 'bg-green-100' : 'bg-red-100') : '';

        return (
          <Card key={question.qId} className={`mb-6 ${inputColorClass}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Question {index + 1}</p>
              <h4 className="font-bold text-large">{question.question}</h4>
            </CardHeader>

            <CardBody className="overflow-visible py-2">
              <div className='max-w-auto'>

                <Accordion variant="shadow" className='bg-gray-200' fullWidth={false}>
                  <AccordionItem key="1" aria-label="Hint" title="Hint">
                    {question.hint}
                  </AccordionItem>
                </Accordion>
              </div>

              <Input
                value={selectedAnswers[question.qId] || ''}
                onChange={(e) => handleInputChange(question.qId, e.target.value)}
                isDisabled={isSubmitted}
                placeholder="Type your answer here"
                fullWidth
                className={`mt-2 ${inputColorClass}`}
              />
              {isSubmitted && (
                <div className="mt-2">
                  <p className={`font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{question.explanation}</p>
                  {!isCorrect && (
                    <p className="mt-1 text-sm text-green-500">Correct Answer: {question.answer}</p>
                  )}
                  {isCorrect && (
                    <p className="mt-1 text-sm text-green-500">Correct Answer: {question.answer}</p>
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

export default FillUpsTestPage;
