import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody } from "@nextui-org/react";

const Dashboard = ({ userId }) => {
  const [testHistory, setTestHistory] = useState([]);

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}/tests`);
        setTestHistory(response.data.tests);
      } catch (error) {
        console.error('Error fetching test history:', error);
      }
    };

    fetchTestHistory();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Test History</h1>
      {testHistory.map(test => (
        <Card key={test._id} className="mb-4">
          <CardBody>
            <h2 className="text-lg font-bold">Topic: {test.topic}</h2>
            <p>Date: {new Date(test.createdAt).toLocaleString()}</p>
            <p>Score: {test.score} / {test.numberOfQuestions}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
