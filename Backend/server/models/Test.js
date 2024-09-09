// File: models/Test.js
const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tests: [
    {
      testType: { type: String, required: true },
      topic: { type: String, required: true },
      numberOfQuestions: { type: Number, required: true },
      complexity: { type: String, required: true },
      generatedTest: [
        {
          qId: { type: Number, required: true },
          question: { type: String, required: true },
          answer: { type: String, required: true },
          hint: { type: String },
        }
      ],
      score: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
      timestamp: { type: Date }
    }
  ]
});

module.exports = mongoose.model('Test', TestSchema);
