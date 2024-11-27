const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // URL of the avatar image
        required: false, // Avatar is optional
        default: 'https://images.unsplash.com/broken' // Default avatar URL
    },
    publishedNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publishNote', // Referencing the 'publishNote' model
    }],
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
