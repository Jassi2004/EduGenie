// controllers/notesController.js
const Note = require("../../models/Note"); // Import the Note model
const User = require("../../models/user"); // Import the Note model
const { geminiFunction } = require('./GeminiController');

// controllers/notesController.js
const generateNotes = async (req, res) => {
  const { topic, timeSetting, complexity } = req.body;
  const userId = req.user.id;

  try {
    // Fetch user to decrement generations
    const user = await User.findById(userId);

    // Decrement user's remaining generations
    console.log("user.generationsLeft: ", user.generationsLeft);

    user.generationsLeft -= 1;
    await user.save();
    console.log("user.generationsLeft: ", user.generationsLeft);

    // Check if user has generations left
    if (user.generationsLeft < 0) {
      return res.status(403).json({ message: 'No note generations left' });
    }

    // Generate notes (your existing code)
    const prompt = `Create concise notes on ${topic} for ${timeSettingOptions[timeSetting]} left before the exam. Focus on ${complexityOptions[complexity]} level of detail. Include key concepts, definitions, examples, and visual aids where applicable.`;

    const generatedContent = await geminiFunction(prompt);

    const newNote = new Note({
      user: userId,
      topic: topic,
      timeSetting: timeSettingOptions[timeSetting],
      complexity: complexityOptions[complexity],
      content: generatedContent,
    });

    await newNote.save();

    // Include content and generations left in the response
    res.json({
      message: 'Notes generated and saved successfully',
      data: {
        ...newNote._doc,
        content: generatedContent
      },
      generationsLeft: user.generationsLeft // Return generations left
    });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: 'Failed to save notes', error: error.message });
  }
};

module.exports = { generateNotes };
