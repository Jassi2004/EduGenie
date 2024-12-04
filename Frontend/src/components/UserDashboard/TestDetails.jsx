import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, Spinner, Button } from '@nextui-org/react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TestDetails = () => {
  const { testId } = useParams(); // Get test ID from URL parameters
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://edugenie-1.onrender.com/api/test-details/${testId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTest(response.data.test);
      } catch (error) {
        console.error('Error fetching test details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  const generatePDF = async () => {
    const element = document.getElementById('test-details');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210; // A4 size width in mm
    const pageHeight = 295; // A4 size height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('test-details.pdf');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <p className="text-xl ml-4">Loading Test Details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Details</h1>
      {test ? (
        <div id="test-details">
          <Card>
            <CardHeader>
              <h4 className="font-bold uppercase">{test.topic}</h4>
            </CardHeader>
            <CardBody>
              {test.generatedTest.map((question, index) => (
                <div key={question.qId} className="mb-4">
                  <p className="font-bold">Question {index + 1}:</p>
                  <p>{question.question}</p>
                  <p><strong>Answer:</strong> {question.answer}</p>
                </div>
              ))}
            </CardBody>
          </Card>
          <div className="mt-4">
            <Button onClick={generatePDF} color="primary">
              Download PDF
            </Button>
          </div>
        </div>
      ) : (
        <p>No details available for this test.</p>
      )}
    </div>
  );
};

export default TestDetails;
