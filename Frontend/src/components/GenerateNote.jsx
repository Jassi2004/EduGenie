import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  Button,
  SelectItem
} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GenerateNotesPage() {
  const [topic, setTopic] = useState('');
  const [timeSetting, setTimeSetting] = useState('');
  const [complexity, setComplexity] = useState('');
  const navigate = useNavigate();

  const timeSettingOptions = ['3 hours', '1 day', '1 week', 'Detailed plan'];
  const complexityOptions = ['Baby', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    }
  }, [navigate]);

  const handleGenerateNotes = async () => {
    const token = localStorage.getItem('token'); // Retrieve the auth token from localStorage

    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate-notes', // Replace with your backend endpoint
        { topic, timeSetting, complexity },
        { headers: { 'Authorization': `Bearer ${token}` } } // Include the token in the Authorization header
      );

      console.log('Notes generated successfully:', response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error('Error generating notes:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Generate Study Notes</h1>
        <Card className="max-w-[800px] mx-auto my-6">
          <CardHeader className="flex justify-center">
            <div className="flex flex-col text-center">
              <p className="text-xl">EduGenie</p>
              <p className="text-sm text-default-500">Create notes for your studies or meetings</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            {/* Topic Setting */}
            <h4 className="text-black font-medium text-lg my-2">Topic:</h4>
            <Input
              type="text"
              variant="bordered"
              placeholder="Enter the topic you want to study"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              aria-label="Topic"
              className="mb-4"
            />

            {/* Time Setting */}
            <h4 className="text-black font-medium text-lg my-2">Time Setting:</h4>
            <Select
              placeholder="Select time available"
              className="max-w-xs w-full mb-4"
              value={timeSetting}
              onChange={(e) => setTimeSetting(e.target.value)}
              aria-label="Select time available"
            >
              {timeSettingOptions.map((timeSetting, index) => (
                <SelectItem key={index} value={timeSetting}>
                  {timeSetting}
                </SelectItem>
              ))}
            </Select>

            {/* Complexity Setting */}
            <h4 className="text-black font-medium text-lg my-2">Complexity Setting:</h4>
            <Select
              placeholder="Select complexity"
              className="max-w-xs w-full mb-4"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              aria-label="Select complexity"
            >
              {complexityOptions.map((complexity, index) => (
                <SelectItem key={index} value={complexity}>
                  {complexity}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleGenerateNotes}
              color="primary"
              size="lg"
              variant="ghost"
              aria-label="Generate Notes"
            >
              Generate Notes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
