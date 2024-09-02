import  { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Textarea,
  Button,
  Image,
  Chip,
  Spacer,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PublishNotesPage() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
    }
  }, [navigate]);

  const handlePublishNotes = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("description", description);
    formData.append("hashtags", JSON.stringify(hashtags));
    formData.append("pdfFile", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/publish-notes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notes published successfully:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error publishing notes:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleHashtagsChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setHashtags([...hashtags, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const removeHashtag = (index) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-8">Generate a New Test</h1>
    <Card className="max-w-[800px] mx-auto my-6">
      <CardHeader className="flex gap-3 items-center">
        <Image
          alt="Logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">EduGenie</p>
          <p className="text-small text-default-500">Publish Your Notes</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
        {/* Topic setting */}
        <h4 className="text-black font-medium text-2xl mt-2">Topic:</h4>
        <Input
          type="text"
          variant="bordered"
          placeholder="Enter the topic of your notes"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Description setting */}
        <h4 className="text-black font-medium text-2xl mt-2">Description:</h4>
        <Textarea
          placeholder="Enter a description for your notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          fullWidth
        />

        {/* Hashtags setting */}
        <h4 className="text-black font-medium text-2xl mt-2">Hashtags:</h4>
        <div>
          <Input
            type="text"
            variant="bordered"
            placeholder="Enter hashtags and press Enter"
            onKeyDown={handleHashtagsChange}
          />
          <Spacer y={0.5} />
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <Chip key={index} onClose={() => removeHashtag(index)}>
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        {/* PDF File Upload */}
        <h4 className="text-black font-medium text-2xl mt-2">Upload PDF:</h4>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          fullWidth
          variant="bordered"
        />
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-center">
        <Button
          onClick={handlePublishNotes}
          color="primary"
          size="lg"
          variant="ghost"
        >
          Publish Notes
        </Button>
      </CardFooter>
    </Card>
    </div>
    </div>
    
  );
}
