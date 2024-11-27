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
    console.log('token got when dashboard element is clicked:', token);
    console.log('--------------------------------');

    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/validate-token", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
        console.log('response.status:', response);

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
        {/* Your Tests Button */}
        <Card
          isHoverable
          isPressable
          variant="bordered"
          className="moving-gradient h-full flex flex-col justify-between p-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex items-center justify-center space-x-2 text-center">
            <h1 className="font-bold text-4xl">Your Tests</h1>
          </CardHeader>
          <p className="text-gray-600 text-center mt-2 mb-4">
            View and manage your created tests.
          </p>
          <CardBody className="flex justify-center">
            <Button
              color="primary"
              variant="ghost"
              className="hover:bg-blue-600 hover:shadow-md transition-all duration-300"
              onClick={() => handleNavigationWithAuth("/your-tests")}
            >
              View Your Tests
            </Button>
          </CardBody>
        </Card>

        {/* Your Notes Button */}
        <Card
          isHoverable
          isPressable
          variant="bordered"
          className="moving-gradient h-full flex flex-col justify-between p-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex items-center justify-center space-x-2 text-center">
            <h1 className="font-bold text-4xl">Your Notes</h1>
          </CardHeader>
          <p className="text-gray-600 text-center mt-2 mb-4">
            View and manage your notes.
          </p>
          <CardBody className="flex justify-center">
            <Button
              color="primary"
              variant="ghost"
              className="hover:bg-blue-600 hover:shadow-md transition-all duration-300"
              onClick={() => handleNavigationWithAuth("/your-notes")}
            >
              View Your Notes
            </Button>
          </CardBody>
        </Card>

        {/* Your Published Notes Button */}
        <Card
          isHoverable
          isPressable
          variant="bordered"
          className="moving-gradient h-full flex flex-col justify-between p-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex items-center justify-center space-x-2 text-center">
            <h1 className="font-bold text-4xl">Your Published Notes</h1>
          </CardHeader>
          <p className="text-gray-600 text-center mt-2 mb-4">
            View your published notes that are available for others.
          </p>
          <CardBody className="flex justify-center">
            <Button
              color="primary"
              variant="ghost"
              className="hover:bg-blue-600 hover:shadow-md transition-all duration-300"
              onClick={() => handleNavigationWithAuth("/your-published-notes")}
            >
              View Published Notes
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
