import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardFooter, Image } from "@nextui-org/react";
import axios from "axios";

function PublishedNotesPage() {
    const [notes, setNotes] = useState([]); // State for storing the notes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:5000/api/get-all-published-notes", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Notes fetched successfully", response.data);
                setNotes(response.data);
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

    const handleLikeDislike = async (noteId, action) => {
        const token = localStorage.getItem("token");

        // Optimistically update the like count
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note._id === noteId
                    ? { ...note, likeCount: action === "like" ? note.likeCount + 1 : Math.max(0, note.likeCount - 1) }
                    : note
            )
        );

        try {
            await axios.post(
                `http://localhost:5000/api/${noteId}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error(`Failed to ${action} note with ID ${noteId}:`, error);
            // Roll back the optimistic update if the request fails
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note._id === noteId
                        ? { ...note, likeCount: action === "like" ? note.likeCount - 1 : note.likeCount + 1 }
                        : note
                )
            );
        }
    };

    // Loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Error state
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <Card key={note._id} isFooterBlurred className="w-96 h-[300px] m-5 shadow-lg transition-all duration-300">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start ">
                        <p className="text-tiny text-black/60 uppercase font-bold">{note.userId.username}</p>
                        <p className="text-tiny text-black/60 uppercase font-bold">
                            {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                        <h4 className="mt-5 text-black/90 font-medium text-xl">Topic: {note.topic.toUpperCase()}</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-auto h-auto object-contain"
                        src="Frontend/src/assets/notes.jpg"
                    />
                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-grow gap-2 items-center">
                            <Image
                                alt="Breathing app icon"
                                className="rounded-full w-10 h-11 bg-black"
                                src="https://nextui.org/images/breathing-app-icon.jpeg"
                            />
                            <div className="flex flex-col">
                                <Button
                                    className="text-tiny text-white/60 max-w-2 bg-blue-300 text-slate-900"
                                    auto
                                    onClick={() => window.open(`http://localhost:5000/${note.pdfFilePath}`, "_blank")}
                                >
                                    View PDF
                                </Button>
                                <Button
                                    className="text-tiny text-white/60 bg-blue-300 text-slate-900 mt-2"
                                    onClick={() => handleDownload(note.pdfFilePath)}
                                >
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <Button
                                radius="full"
                                size="sm"
                                className="bg-green-500 text-white"
                                onClick={() => handleLikeDislike(note._id, "like")}
                            >
                                👍 Like
                            </Button>
                            <Button
                                radius="full"
                                size="sm"
                                className="bg-red-500 text-white"
                                onClick={() => handleLikeDislike(note._id, "dislike")}
                            >
                                👎 Dislike
                            </Button>
                            <span className="text-white ml-2">Likes: {note.likeCount}</span>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default PublishedNotesPage;
