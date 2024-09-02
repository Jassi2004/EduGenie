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

export default function GenerateTestPage() {
  const [testType, setTestType] = useState("");
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const navigate = useNavigate();

  // Check for the authentication token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    }
  }, [navigate]);

  const testTypeOptions = ["mcq", "fill-in-the-blanks", "question-answers"];

  const handleGenerateTest = async () => {
    const token = localStorage.getItem("token"); // Retrieve the auth token from localStorage

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-test", // Replace with your backend endpoint
        { testType:testTypeOptions[testType], topic, numberOfQuestions },
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in the Authorization header
      );

      console.log("Test generated successfully:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error generating test:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Generate a New Test</h1>
        <Card className="max-w-[800px] mx-auto my-6">
          <CardHeader className="flex gap-3 justify-center">
            <div className="flex flex-col text-center">
              <p className="text-xl">EduGenie</p>
              <p className="text-sm text-default-500">Create a test for practice or exams</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            {/* Test Type Setting */}
            <h4 className="text-black font-medium text-lg my-2">Test Type:</h4>
            <Select
              placeholder="Select test type"
              className="max-w-xs w-full mb-4"
              value={testType}
              onChange={(e) => setTestType(e.target.value)} // Correctly extract value from the event
              aria-label="Select test type"
            >
              {testTypeOptions.map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>

            {/* Topic Setting */}
            <h4 className="text-black font-medium text-lg my-2">Topic:</h4>
            <Input
              type="text"
              variant="bordered"
              placeholder="Enter the topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              aria-label="Topic"
              className="mb-4"
            />

            {/* Number of Questions Setting */}
            <h4 className="text-black font-medium text-lg my-2">Number of Questions:</h4>
            <Input
              type="number"
              variant="bordered"
              placeholder="Enter number of questions"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              aria-label="Number of questions"
              className="mb-4"
            />
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleGenerateTest}
              color="primary"
              size="lg"
              variant="ghost"
              aria-label="Generate Test"
            >
              Generate Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
