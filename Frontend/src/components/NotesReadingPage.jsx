import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import { jsPDF } from "jspdf"; // Import jspdf

export default function NotesReadingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Correctly access the generated notes content
  const generatedNotes = location.state?.generatedNotes;

  // Debugging log statements
  console.log("Location state:", location.state);
  console.log("Generated Notes Data:", generatedNotes);

  if (!generatedNotes || !generatedNotes.content) {
    // Handle the case where notes are not available
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">Generated Notes</h1>
          <Card className="max-w-[800px] mx-auto my-6">
            <CardBody className="p-6">
              <p className="text-center text-red-500">
                No notes to display. Please generate notes first.
              </p>
            </CardBody>
            <Divider />
            <div className="flex justify-center p-4">
              <Button
                onClick={() => navigate("/generate-notes")}
                color="primary"
                size="md"
                variant="ghost"
                aria-label="Generate More Notes"
              >
                Generate More Notes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Access the text from the generated notes content
  const noteText = generatedNotes.content.parts[0].text;
  console.log("Note Text:", noteText);

  // Function to download the notes as a PDF file
  const downloadNotesAsPDF = () => {
    const doc = new jsPDF(); // Create a new jsPDF instance

    // Add title and metadata
    doc.setFontSize(16);
    doc.text("Generated Notes", 20, 20);
    doc.setFontSize(12);
    doc.text(`Topic: ${generatedNotes.topic}`, 20, 30);
    doc.text(`Time: ${generatedNotes.timeSetting}, Complexity: ${generatedNotes.complexity}`, 20, 40);
    doc.text("Notes:", 20, 50);

    // Split the notes text into lines and handle bold formatting
    doc.setFontSize(10);
    const lines = noteText.split('\n'); // Split text by lines
    let y = 60; // Initial Y position for notes content

    lines.forEach((line) => {
      if (line.startsWith("* **")) {
        // This line starts with a bullet point and bold text
        const bulletIndex = line.indexOf("**") + 2; // Find the end of '**'
        const bulletText = line.substring(bulletIndex).trim(); // Extract text after '**'
        
        doc.setFont("helvetica", "bold");
        doc.text("*", 20, y); // Draw bullet point
        doc.text(bulletText, 25, y); // Draw bold text for the bullet point
      } else if (line.startsWith("*")) {
        // This line is a bullet point
        doc.setFont("helvetica", "bold");
        doc.text("*", 20, y); // Draw bullet point
        doc.setFont("helvetica", "normal");
        doc.text(line.substring(1).trim(), 25, y); // Draw normal text after bullet
      } else {
        // Normal text
        doc.setFont("helvetica", "normal");
        const splitLine = doc.splitTextToSize(line, 170);
        doc.text(splitLine, 20, y);
      }
      y += 10; // Move Y position down for next line
    });

    // Save the PDF
    doc.save("Generated_Notes.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-md">
        <div className="flex justify-between mb-4">
          <Button
            onClick={downloadNotesAsPDF}
            color="success"
            size="md"
            variant="ghost"
            aria-label="Download Notes"
          >
            Download Notes
          </Button>
          <Button
            onClick={() => navigate("/generate-notes")}
            color="primary"
            size="md"
            variant="ghost"
            aria-label="Generate More Notes"
          >
            Generate More Notes
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">Generated Notes</h1>
        <Card className="max-w-[800px] mx-auto my-6">
          <CardHeader className="flex justify-center">
            <div className="flex flex-col text-center">
              <p className="text-xl font-semibold">Notes for Topic: {generatedNotes.topic}</p>
              <p className="text-sm text-default-500">Time: {generatedNotes.timeSetting}, Complexity: {generatedNotes.complexity}</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <div className="whitespace-pre-wrap">
              {noteText} {/* Display the text properly */}
            </div>
          </CardBody>
          <Divider />
          <div className="flex justify-center p-4">
            <Button
              onClick={() => navigate("/generate-notes")}
              color="primary"
              size="md"
              variant="ghost"
              aria-label="Generate More Notes"
            >
              Generate More Notes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
