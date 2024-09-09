const fs = require('fs'); // Import the File System module
const path = require('path');
const Test = require('../../models/Test');
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
        // Check if an entry already exists for this user
        let existingUserTests = await Test.findOne({ userId });

        // Construct the prompt for the Gemini API
        let prompt = `Generate a ${testType} test on the topic of ${topic} with ${numberOfQuestions} questions. Ensure the test matches the intermediate difficulty level, and include correct answers and explanations for each question. The complexity of the test should be ${complexity}.`;

        if (testType === 'mcq') {
            prompt += ` Provide output in the following JSON format: [{"qId": 1, "question": "This is the question?", "optionA": "This is option A", "optionB": "This is option B", "optionC": "This is option C", "optionD": "This is option D", "answer": "This is the correct answer in text form"}] without any newline characters. Ensure that the "answer" field contains the actual text of the correct option, not its label.`;
        }
         else if (testType === 'fill-in-the-blanks') {
            prompt += ` Provide output in a strict JSON format. Each question should follow this format: 
            [{"qId": 1, "question": "A complete sentence with one or more blanks represented as *****", "answer": "Correct answer for the blank", "hint" : "a small hint related to the answer"}]. 
            Ensure that the "question" field contains a complete sentence with a clearly indicated blank (*****), and the "answer" field provides the correct word or phrase for that blank. Do not include any additional text, explanations, or formatting outside of this JSON structure.`;
        }

        // Generate test using an API or function
        const generatedTest = await geminiFunction(prompt);
        console.log("generatedTest: ", generatedTest);
        
        let testString = generatedTest.parts[0].text;
        console.log("testString 1: ", testString);
        
        testString = testString.replace(/```json|```/g, '').trim();
        console.log("testString 2: ", testString);
        
        let parsedTest;
        try {
            parsedTest = JSON.parse(testString);
        } catch (parseError) {
            return res.status(500).json({ message: 'Failed to parse test response to JSON format' });
        }

        // Save JSON to file
        const outputDir = path.join(__dirname, '../../output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir); // Create the output directory if it doesn't exist
        }
        const outputFilePath = path.join(outputDir, 'generatedTest.json');
        fs.writeFileSync(outputFilePath, JSON.stringify(parsedTest, null, 2)); // Save the JSON data to the file
        
        console.log('JSON saved to:', outputFilePath); // Log to confirm the file was saved

        const newTestEntry = {
            testType,
            topic,
            numberOfQuestions,
            complexity,
            generatedTest: parsedTest,
            createdAt: new Date()
        };

        if (existingUserTests) {
            existingUserTests.tests.push(newTestEntry);
            await existingUserTests.save();
            res.json({ message: 'New test added to existing user entry', data: existingUserTests });
        } else {
            const newTestDocument = new Test({
                userId,
                tests: [newTestEntry]
            });
            await newTestDocument.save();
            res.json({ message: 'New test generated and saved successfully', data: newTestDocument });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate or save test' });
    }
};


module.exports = { generateTest };
