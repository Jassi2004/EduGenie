import { Card } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Overview() {
    const clipboardImg = "../../../public/icons/clipboard.png";
    const boardImg = "../../../public/icons/board.png";
    const usersImg = "../../../public/icons/users.png";

    const [testCount, setTestCount] = useState(0);
    const [publishedNotesCount, setPublishedNotesCount] = useState(0);
    const [notesCount, setnotesCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const testResponse = await axios.get('https://edugenie-1.onrender.com/api/get-user-tests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const publishedNotesResponse = await axios.get("https://edugenie-1.onrender.com/api/published-notes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const notesResponse = await axios.get('https://edugenie-1.onrender.com/api/get-user-notes', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // console.log("testResponse.data.tests.length:", testResponse.data.tests[0].tests.length);


                setTestCount(testResponse.data.tests[0].tests.length);
                setnotesCount(notesResponse.data.notes.length);
                setPublishedNotesCount(publishedNotesResponse.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    const handleNavigationWithAuth = async (url) => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const response = await axios.get("https://edugenie-1.onrender.com/api/validate-token", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    navigate(url);
                } else {
                    alert("Invalid or expired token. Please log in again.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error during token validation:", error);
                alert("An error occurred. Please try again.");
            }
        } else {
            alert("You need to log in first!");
            navigate("/login");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-20">
            {/* Test Count Card */}
            <Card
                className="w-full p-5 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl  pop-up"
                isPressable
                onClick={() => handleNavigationWithAuth("/your-tests")}
            >
                <div className="flex items-center gap-5">
                    <img src={clipboardImg} alt="Test Icon" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
                    <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-semibold">Total Tests Generated</h4>
                        <h5 className="text-3xl font-bold">{testCount}</h5>
                    </div>
                </div>
                <ArrowRight className="absolute bottom-5 right-5 w-8 h-8 text-white" />
            </Card>

            {/* Notes Count Card */}
            <Card
                className="w-full p-5 rounded-3xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl pop-up"
                isPressable
                onClick={() => handleNavigationWithAuth("/your-notes")}
            >
                <div className="flex items-center gap-5">
                    <img src={boardImg} alt="Notes Icon" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
                    <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-semibold">Total Notes Generated</h4>
                        <h5 className="text-3xl font-bold">{notesCount}</h5>
                    </div>
                </div>
                <ArrowRight className="absolute bottom-5 right-5 w-8 h-8 text-white" />
            </Card>

            {/* Published Notes Count Card */}
            <Card
                className="w-full p-5 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl pop-up"
                isPressable
                onClick={() => handleNavigationWithAuth("/your-published-notes")}
            >
                <div className="flex items-center gap-5">
                    <img src={usersImg} alt="Published Notes Icon" className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
                    <div className="flex flex-col justify-center">
                        <h4 className="text-lg font-semibold">Total Notes Published</h4>
                        <h5 className="text-3xl font-bold">{publishedNotesCount}</h5>
                    </div>
                </div>
                <ArrowRight className="absolute bottom-5 right-5 w-8 h-8 text-white" />
            </Card>
        </div>
    );
}

export default Overview;
