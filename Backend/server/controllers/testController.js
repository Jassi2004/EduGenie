// controllers/testController.js

const Test = require('../models/Test');

const generateTest = async (req, res) => {
    const { testType, topic, numberOfQuestions } = req.body;
    const userId = req.user.id; // This should correctly reference the user's ID

    console.log('-------------------------------' , '\n');
    console.log('log statements from testController.js');
    
    
    console.log('Received test type:', testType);
    console.log('Received topic:', topic);
    console.log('Received number of questions:', numberOfQuestions);
    console.log('User ID:', userId); 
    console.log('-------------------------------');

    // Generate the questions based on the test type and topic
    const questions = Array.from({ length: numberOfQuestions }, (_, i) => ({
        question: `Question ${i + 1} on ${topic} for ${testType}`,
        options: testType === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : [],
        answer: testType === 'mcq' ? 'Option A' : 'Answer text'
    }));

    try {
        // Create a new Test document
        const newTest = new Test({
            userId,
            testType,
            topic,
            numberOfQuestions,
            questions
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
