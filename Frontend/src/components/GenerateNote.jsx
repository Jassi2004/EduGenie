import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Input,
  Select,
  Button,
  SelectItem
} from "@nextui-org/react";
import axios from 'axios';
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
      navigate("/login"); // Redirect to the dashboard or login page
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
      // You might want to show a success message or navigate to another page
    } catch (error) {
      console.error('Error generating notes:', error.response ? error.response.data : error.message);
      // Handle the error, show a notification, etc.
    }
  };

  return (
    <Card className="max-w-[800px] max-h-screen mx-auto my-6">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">EduGenie</p>
          <p className="text-small text-default-500">Generate Notes </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>

        {/* Topic setting */}
        <h4 className="text-black font-medium text-2xl my-2">Topic: </h4>
        <div className="w-full flex flex-col gap-4 my-2">
          <div key="bordered" className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              type="text"
              variant="bordered"
              placeholder="Enter the topic you want to study"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>

        {/* Time Setting */}
        <h4 className="text-black font-medium text-2xl my-2">Time Setting: </h4>
        <Select
          placeholder="Select time available"
          className="max-w-xs"
          value={timeSetting}
          onChange={(e) => setTimeSetting(e)}
          aria-label="Select time available"  // Added aria-label for accessibility
        >
          {timeSettingOptions.map((timeSetting, index) => (
            <SelectItem key={index} value={timeSetting} className="text-black">
              {timeSetting}
            </SelectItem>
          ))}
        </Select>

        {/* Complexity setting */}
        <h4 className="text-black font-medium text-2xl my-2">Complexity Setting: </h4>
        <Select
          placeholder="Select complexity"
          className="max-w-xs"
          value={complexity}
          onChange={(e) => setComplexity(e)}
          aria-label="Select complexity"  // Added aria-label for accessibility
        >
          {complexityOptions.map((complexity, index) => (
            <SelectItem key={index} value={complexity} className="text-black">
              {complexity}
            </SelectItem>
          ))}
        </Select>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-center">
        <Button onClick={handleGenerateNotes} color="primary" size="lg" variant="ghost">
          Generate Notes
        </Button>  
      </CardFooter>
    </Card>
  );
}
