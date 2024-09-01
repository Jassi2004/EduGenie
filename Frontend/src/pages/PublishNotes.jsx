import { useState } from 'react';

const PublishNotes = () => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [pdfFile, setPdfFile] = useState(null); // This will store the PDF file
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle file uploads
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('description', description);
        formData.append('hashtags', hashtags);
        formData.append('pdf', pdfFile); // Append the file with the correct field name

        try {
            const response = await fetch('http://localhost:5000/api/publish-notes', {
                method: 'POST',
                body: formData, // FormData is used to send multipart/form-data
            });

            // Ensure proper handling of the response
            if (response.ok) {
                const data = await response.json();
                setResponseMessage(data.message || 'Notes published successfully!');
                console.log('Response from backend:', data);
            } else {
                const errorData = await response.text(); // Try to parse the error response
                setResponseMessage(`Failed to publish notes: ${errorData}`);
                console.log('Failed to publish notes:', errorData);
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            setResponseMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <div className="publish-notes-container">
            <h1>Publish Notes</h1>
            <form onSubmit={handleSubmit} className="publish-notes-form">
                <div className="form-group">
                    <label htmlFor="topic">Topic or Subject:</label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description of Notes:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="hashtags">Hashtags:</label>
                    <input
                        type="text"
                        id="hashtags"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        placeholder="Separate hashtags with commas"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pdfFile">Upload PDF:</label>
                    <input
                        type="file"
                        id="pdfFile"
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Publish Notes</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default PublishNotes;
