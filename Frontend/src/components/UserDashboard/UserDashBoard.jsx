import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/get-user-tests', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Log the response to debug
        console.log("response data:", response.data.tests[0].tests);

        // Ensure response.data.tests is an array
        if (Array.isArray(response.data.tests[0].tests)) {
          // Reverse the order of tests
          const reversedTests = [...response.data.tests[0].tests].reverse();
          setTests(reversedTests);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/test-details/${testId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <p className="text-xl ml-4">Loading Tests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      {tests.length === 0 ? (
        <p>No tests found.</p>
      ) : (
        tests.map(test => (
          <Card key={test._id} className="mb-4">
            <CardHeader>
              <h4 className="font-bold uppercase">{test.topic}</h4>
            </CardHeader>
            <CardBody>
              <p><strong>Complexity:</strong> {test.complexity}</p>
              <p><strong>Number of questions:</strong> {test.numberOfQuestions}</p>
              <p><strong>Score:</strong> {test.score}/{test.numberOfQuestions}</p>
              <p><strong>Time:</strong> {new Date(test.createdAt).toLocaleString()}</p>
            </CardBody>
            <CardFooter>
              <Button onClick={() => handleTestClick(test._id)} color="primary">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default UserDashboard;
