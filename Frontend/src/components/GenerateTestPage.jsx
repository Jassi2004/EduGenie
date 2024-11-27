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
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GenerateTestPage() {
  const [testType, setTestType] = useState("");
  const [topic, setTopic] = useState("");
  const [complexity, setComplexity] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Check for the authentication token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    }
  }, [navigate]);

  const testTypeOptions = ["mcq", "fill-in-the-blanks"];
  const complexityOptions = ['Baby', 'Beginner', 'Intermediate', 'Advanced'];


  const handleGenerateTest = async () => {
    const token = localStorage.getItem("token"); // Retrieve the auth token from localStorage
    setLoading(true); // Set loading to true when fetching starts

    try {
      console.log("Requesting test...");
      await axios.post(
        "http://localhost:5000/api/generate-test",
        {
          testType: testTypeOptions[testType],
          topic,
          numberOfQuestions,
          complexity: complexityOptions[complexity],
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
        }
      );

      console.log("Test generation request sent successfully.");
    } catch (error) {
      console.error("Error generating test:", error.response || error.message);
    } finally {
      setLoading(false); // Stop loading spinner
      // Redirect after a 2-second delay
      setTimeout(() => {
        if (testType == 0) {
          navigate("/test-display/mcq", { state: { topic } });
        } else if (testType == 1) {
          navigate("/test-display/fill-ups");
        }
      }, 2000); // Redirect after 2 seconds
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
            {loading ? (
              // Show the loading spinner or progress bar when loading
              <div className="flex flex-col items-center justify-center my-8">
                {/* Spinner example */}
                <Spinner size="lg" />
                <p className="text-xl">Generating Test... Please Wait...</p>
              </div>
            ) : (
              <>
                {/* Test Type Setting */}
                <h4 className="text-black font-medium text-lg my-2">Test Type:</h4>
                <Select
                  placeholder="Select test type"
                  className="max-w-xs w-full mb-4"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
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
                {/* Complexity Setting */}
                <h4 className="text-black font-medium text-lg my-2">Complexity:</h4>
                <Select
                  placeholder="Select complexity type"
                  className="max-w-xs w-full mb-4"
                  value={testType}
                  onChange={(e) => setComplexity(e.target.value)}
                  aria-label="Select complexity type"
                >
                  {complexityOptions.map((type, index) => (
                    <SelectItem key={index} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>
              </>
            )}
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleGenerateTest}
              color="primary"
              size="lg"
              variant="ghost"
              aria-label="Generate Test"
              disabled={loading} // Disable button when loading
            >
              Generate Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
