import React, { useState, useEffect } from "react";
import { Button, Card, Chip } from "@nextui-org/react";
import axios from "axios";
import {
    Download,
    Eye,
    ThumbsUp,
    User,
    Calendar,
    BookOpen,
    CirclePlus
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

function PublishedNotesPage() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    const Icon = CirclePlus;

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:5000/api/get-all-published-notes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("notes response : ", response.data);

                setNotes(response.data || []);
                setLoading(false);
            } catch (error) {
                setError("Failed to load published notes.");
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const handleDownload = (filePath) => {
        const url = `http://localhost:5000/${filePath}`;
        const link = document.createElement("a");
        link.href = url;
        link.download = filePath.split("/").pop();
        link.click();
    };

    const handleLikeToggle = async (noteId, liked) => {
        const token = localStorage.getItem("token");

        // Toggle like state (if already liked, un-like, else like)
        const newLikeCount = liked ? -1 : 1;

        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note._id === noteId
                    ? { ...note, likeCount: note.likeCount + newLikeCount, likedByUser: !liked }
                    : note
            )
        );

        try {
            await axios.post(
                `http://localhost:5000/api/${noteId}/${liked ? 'dislike' : 'like'}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error(`Failed to ${liked ? 'dislike' : 'like'} note with ID ${noteId}:`, error);
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note._id === noteId
                        ? { ...note, likeCount: note.likeCount - newLikeCount, likedByUser: liked }
                        : note
                )
            );
        }
    };

    const navigate = useNavigate();

    const handleNavigationWithAuth = async (url) => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const response = await axios.get("http://localhost:5000/api/validate-token", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    navigate('/publish-notes');
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

    const filteredNotes = filter === "all"
        ? notes
        : notes.filter(note => note.topic.toLowerCase() === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    <BookOpen className="w-16 h-16 text-cyan-500" />
                    <p className="text-gray-600 mt-4">Loading Notes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 mb-4">
                        Community Notes
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore, learn, and grow with notes shared by your peers
                    </p>

                    <Icon
                        className="text-cyan-600 w-24 h-24 
              transition-all duration-500
              group-hover:rotate-[15deg] absolute top-20 right-20"
                        onClick={handleNavigationWithAuth}
                    />
                </div>

                {/* Filters */}
                <div className="flex justify-center space-x-4 mb-12">
                    {["all", "math", "science", "history", "literature"].map((topic) => (
                        <Chip
                            key={topic}
                            className={`
                                cursor-pointer 
                                transition-all duration-300
                                ${filter === topic
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                            `}
                            onClick={() => setFilter(topic)}
                        >
                            {topic.charAt(0).toUpperCase() + topic.slice(1)}
                        </Chip>
                    ))}
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNotes.map((note) => (
                        <Card
                            key={note._id}
                            className="
                                bg-white 
                                rounded-3xl 
                                shadow-xl 
                                overflow-hidden 
                                transform transition-all 
                                duration-300 
                                hover:scale-105 
                                hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]
                            "
                        >
                            {/* Note Header */}
                            <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 min-h-48 mt-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-cyan-600" />
                                        <span className="text-sm text-gray-600">
                                            {note.userId?.username || "Unknown User"}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl mt-5 font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
                                    {note.topic.toUpperCase()}
                                </h3>
                            </div>

                            {/* Note Actions */}
                            <div className="p-6 space-y-4">
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => window.open(`http://localhost:5000/${note.pdfFilePath}`, "_blank")}
                                        className="
                                            flex-1 
                                            bg-gradient-to-r from-cyan-500 to-blue-600 
                                            text-white 
                                            hover:from-cyan-600 hover:to-blue-700 
                                        "
                                        startContent={<Eye className="w-5 h-5" />}
                                    >
                                        View PDF
                                    </Button>
                                    <Button
                                        onClick={() => handleDownload(note.pdfFilePath)}
                                        className="
                                            flex-1 
                                            bg-white 
                                            border-2 border-cyan-500 
                                            text-cyan-600 
                                            hover:bg-cyan-50
                                        "
                                        startContent={<Download className="w-5 h-5" />}
                                    >
                                        Download
                                    </Button>
                                </div>

                                {/* Like/Dislike Section */}
                                <div className="flex justify-between items-baseline mt-10">
                                    <div className="flex space-x-2 align-bottom">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={() => handleLikeToggle(note._id, note.likedByUser)}
                                            className={note.likedByUser ? 'text-green-600 bg-green-50 -mt-2' : 'text-gray-600 hover:bg-gray-200 -mt-2'}
                                        >
                                            <ThumbsUp className={`w-5 h-5 ${note.likedByUser ? 'fill-current text-green-600' : ''}`} />
                                        </Button>
                                        <span className="ml-2 text-gray-600">
                                            Likes: {note.likeCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredNotes.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600">
                            No notes found for this category
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PublishedNotesPage;
