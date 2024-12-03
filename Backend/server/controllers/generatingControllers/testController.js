const fs = require('fs');
const path = require('path');
const Test = require('../../models/Test');
const User = require('../../models/user'); // Ensure you have a User model to manage user data
const { geminiFunction } = require('./GeminiController');

const generateTest = async (req, res) => {
    const { testType, topic, numberOfQuestions, complexity } = req.body;
    const userId = req.user.id; // Authenticated user ID from middleware

    console.log('-------------------------------');
    console.log('Log statements from testController.js');
    console.log('Received testType:', testType);
    console.log('Received topic:', topic);
    console.log('Received numberOfQuestions:', numberOfQuestions);
    console.log('Received complexity:', complexity);
    console.log('User ID:', userId);
    console.log('-------------------------------');

    try {
        // Fetch user data to check remaining generations
        const user = await User.findById(userId);
        // Decrement user's remaining generations
        console.log("user.generationsLeft: ", user.generationsLeft);
        user.generationsLeft -= 1;
        await user.save();
        console.log("user.generationsLeft: ", user.generationsLeft);


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.generationsLeft <= 0) {
            return res.status(403).json({ message: 'No test generations left' });
        }

        // Construct the prompt for the Gemini API
        let prompt = `Generate a ${testType} test on the topic of ${topic} with ${numberOfQuestions} questions. Ensure the test matches the intermediate difficulty level, and include correct answers and explanations for each question. The complexity of the test should be ${complexity}.`;

        if (testType === 'mcq') {
            prompt += ` Provide output in the following JSON format: [{"qId": 1, "question": "This is the question?", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "answer": "The correct answer in text form"}].`;
        } else if (testType === 'fill-in-the-blanks') {
            prompt += ` Provide output in the following JSON format: [{"qId": 1, "question": "A sentence with ***** for the blank", "answer": "Correct answer", "hint": "Hint for the answer"}].`;
        }

        // Generate test using Gemini API
        const generatedTest = await geminiFunction(prompt);
        let testString = generatedTest.parts[0].text.replace(/```json|```/g, '').trim();

        // Parse the JSON string to an object
        let parsedTest;
        try {
            parsedTest = JSON.parse(testString);
        } catch (error) {
            console.error('Error parsing JSON:', error.message);
            return res.status(500).json({ message: 'Failed to parse test response' });
        }

        // Save JSON to file
        const outputDir = path.join(__dirname, '../../output');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        const outputFilePath = path.join(outputDir, `generatedTest.json`);
        fs.writeFileSync(outputFilePath, JSON.stringify(parsedTest, null, 2));
        console.log('JSON saved to:', outputFilePath);

        // Save test to database
        const newTestEntry = {
            testType,
            topic,
            numberOfQuestions,
            complexity,
            generatedTest: parsedTest,
            createdAt: new Date()
        };

        let userTests = await Test.findOne({ userId });
        if (userTests) {
            userTests.tests.push(newTestEntry);
            await userTests.save();
        } else {
            userTests = new Test({ userId, tests: [newTestEntry] });
            await userTests.save();
        }



        res.json({
            message: 'Test generated and saved successfully',
            data: userTests,
            generationsLeft: user.generationsLeft
        });
    } catch (error) {
        console.error('Error in generateTest:', error.message);
        res.status(500).json({ message: 'Failed to generate or save test', error: error.message });
    }
};

module.exports = { generateTest };
