// src/components/Dashboard.jsx
// import React from "react";
import { Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import axios from "axios"; // Import axios

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle navigation with token in the headers
  const handleNavigationWithAuth = async (url) => {
    // Retrieve the auth token from localStorage
    const token = localStorage.getItem("token");
    console.log('--------------------------------');
    console.log('token got when dashboards element is clicked' , token);
    console.log('--------------------------------');
    

    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/validate-token", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
        console.log('response.status: ' , response);
        

        if (response.status === 200) {
          // If the token is valid, navigate to the desired page
          navigate(url);
        } else {
          alert("Invalid or expired token. Please log in again.");
          navigate("/login"); // Redirect to login if token is invalid
        }
      } catch (error) {
        console.error("Error during token validation:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("You need to log in first!");
      navigate("/login"); // Redirect to login page if no token found
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate Test Card */}
        <Card
          isHoverable
          isPressable
          variant="bordered"
          className="moving-gradient h-full flex flex-col justify-between p-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex items-center justify-center space-x-2 text-center">
            <h1 className="font-bold text-4xl">Generate Test</h1>
          </CardHeader>
          <p className="text-gray-600 text-center mt-2 mb-4">
            Quickly create organized test for your practice or exams.
          </p>
          <CardBody className="flex justify-center">
            <Button
              color="primary"
              variant="ghost"
              className="hover:bg-blue-600 hover:shadow-md transition-all duration-300"
              onClick={() => handleNavigationWithAuth("/generate-test")}
            >
              Generate Test
            </Button>
          </CardBody>
          <Button
            auto
            flat
            color="primary"
            className="text-sm mx-3"
            onClick={() => alert("still under development!")}
          >
            Learn More
          </Button>
        </Card>

        {/* Generate Notes Card */}
        <Card
          isHoverable
          isPressable
          variant="bordered"
          className="moving-gradient h-full flex flex-col justify-between p-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex items-center justify-center space-x-2 text-center">
            <h1 className="font-bold text-4xl">Generate Notes</h1>
          </CardHeader>
          <p className="text-gray-600 text-center mt-2 mb-4">
            Quickly create organized notes for your meetings or study sessions.
          </p>
          <CardBody className="flex justify-center">
            <Button
              color="primary"
              variant="ghost"
              className="hover:bg-blue-600 hover:shadow-md transition-all duration-300"
              onClick={() => handleNavigationWithAuth("/generate-notes")}
            >
              Generate Notes
            </Button>
          </CardBody>
          <Button
            auto
            flat
            color="primary"
            className="text-sm mx-3"
            onClick={() => alert("still under development!")}
          >
            Learn More
          </Button>
        </Card>

        {/* Publish Notes Card */}
        <Card
          isHoverable
          isPressable
          variant="bordered"
          className="moving-gradient h-full flex flex-col justify-between p-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex items-center justify-center space-x-2 text-center">
            <h1 className="font-bold text-4xl">Publish Notes</h1>
          </CardHeader>
          <p className="text-gray-600 text-center mt-2 mb-4">
            Publish your notes to help others.
          </p>
          <CardBody className="flex justify-center">
            <Button
              color="primary"
              variant="ghost"
              className="hover:bg-blue-600 hover:shadow-md transition-all duration-300"
              onClick={() => handleNavigationWithAuth("/publish-notes")}
            >
              Publish Notes
            </Button>
          </CardBody>
          <Button
            auto
            flat
            color="primary"
            className="text-sm mx-3"
            onClick={() => alert("still under development!")}
          >
            Learn More
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
