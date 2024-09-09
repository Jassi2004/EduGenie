const fs = require('fs'); // Import the File System module
const path = require('path');
const Test = require('../models/Test');
const { geminiFunction } = require('./GeminiController');

const generateTest = async (req, res) => {
    const { testType, topic, numberOfQuestions, complexity } = req.body;
    const userId = req.user.id; // This should correctly reference the user's ID

    console.log('-------------------------------', '\n');
    console.log('Log statements from testController.js', '\n');

    console.log('Received test type:', testType);
    console.log('Received topic:', topic);
    console.log('Received number of questions:', numberOfQuestions);
    console.log('Received complexity of questions:', complexity);
    console.log('User ID:', userId);
    console.log('-------------------------------');

    try {
        // Construct the prompt for the Gemini API
        let prompt = `Generate a ${testType} test on the topic of ${topic} with ${numberOfQuestions} questions. Ensure the test matches the intermediate difficulty level, and include correct answers and explanations for each question. The complexity of the test should be ${complexity}.`;
        
        if (testType === 'mcq') {
            prompt += ` Provide output in the following JSON format: [{"qId": 1, "question": "This is the question?", "optionA": "This is option A", "optionB": "This is option B", "optionC": "This is option C", "optionD": "This is option D", "answer": "This is the answer"}] without any newline characters.`;
        } else if (testType === 'fill-in-the-blanks') {
            prompt += ` Provide output in a strict JSON format. Each question should follow this format: 
            [{"qId": 1, "question": "A complete sentence with one or more blanks represented as *****", "answer": "Correct answer for the blank", "hint" : "a small hint related to the answer}]. 
            Ensure that the "question" field contains a complete sentence with a clearly indicated blank (*****), and the "answer" field provides the correct word or phrase for that blank. Do not include any additional text, explanations, or formatting outside of this JSON structure.`;
        }

        // Generate the test using the Gemini API function
        const generatedTest = await geminiFunction(prompt);
        let testString = generatedTest.parts[0].text;
        console.log('Generated test (string):', testString);

        // Remove backticks and any language identifiers from the response
        testString = testString.replace(/```json|```/g, '').trim();

        // Parse the cleaned test string to JSON
        let parsedTest;
        try {
            parsedTest = JSON.parse(testString);
        } catch (parseError) {
            console.error('Error parsing test to JSON:', parseError);
            return res.status(500).json({ message: 'Failed to parse test response to JSON format' });
        }

        // Save the generated test to a JSON file
        const filePath = path.join(__dirname, '..', 'output', 'generatedTest.json');
        fs.writeFileSync(filePath, JSON.stringify(parsedTest, null, 2), 'utf8');
        console.log(`Test saved to ${filePath}`);

        // Create a new Test document
        const newTest = new Test({
            userId,
            testType,
            topic,
            numberOfQuestions,
            generatedTest: parsedTest
        });

        // Save the Test document to the database
        await newTest.save();

        res.json({ message: 'Test generated and saved successfully', data: newTest });
    } catch (error) {
        console.error('Error generating or saving test:', error);
        res.status(500).json({ message: 'Failed to generate or save test' });
    }
};

module.exports = { generateTest };