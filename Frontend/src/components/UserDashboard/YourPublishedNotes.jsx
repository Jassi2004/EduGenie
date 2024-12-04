import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardFooter,
    Button,
    Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function YourPublishedNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState("");
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchPublishedNotes = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/published-notes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setNotes(response.data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                setError("Failed to load published notes.");
                setLoading(false); // Set loading to false if there's an error
            }
        };

        fetchPublishedNotes();
    }, []);


    const handleDownload = (filePath) => {
        const url = `https://edugenie-1.onrender.com/${filePath}`; // Correct URL for download
        const link = document.createElement("a");
        link.href = url;
        link.download = filePath.split("/").pop();
        link.click();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Spinner size="lg" />
                <p className="text-xl mt-4">Loading your notes...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">{error}</p>; // Replaced Text with <p>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-center mb-8">Your Published Notes</h1>

                {notes.length === 0 ? (
                    <p>No notes published yet. Start publishing!</p>
                ) : (
                    notes.map((note) => (
                        <Card key={note._id} className="mb-4">
                            <CardHeader>
                                <div className="flex flex-col justify-between">
                                    <h3 className="text-3xl">{note.topic}</h3>

                                    <p>{note.description}</p>
                                </div>
                            </CardHeader>
                            {/* <CardBody>
                                <div className="flex gap-4">
                                    {note.hashtags.map((hashtag, index) => (
                                        <span key={index} className="text-blue-600">#{hashtag}</span>
                                    ))}
                                </div>
                            </CardBody> */}
                            <CardFooter className="flex justify-between">
                                <Button auto onClick={() => handleDownload(note.pdfFilePath)}>
                                    Download PDF
                                </Button>
                                <Button auto onClick={() => window.open(`https://edugenie-1.onrender.com/${note.pdfFilePath}`, '_blank')}>
                                    View PDF
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
