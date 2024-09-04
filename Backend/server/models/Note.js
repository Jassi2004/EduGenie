// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User model
  topic: { 
    type: String, 
    required: true 
  },
  timeSetting: { 
    type: String, 
    required: true 
  },
  complexity: { 
    type: String, 
    required: true 
  },
  content: { 
    type: Object, // Can use Object or a more specific schema if you know the structure
    required: true 
  }, // Stores the generated content
  generatedAt: { 
    type: Date, 
    default: Date.now 
  } // Timestamp for when the note was generated
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
