const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['candidate', 'admin'],
        default: 'candidate',
    },
    name: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    skills: {
        type: [String],
        default: [],
    },
    resumePath: {
        type: String,
        default: '',
    },
    resumeKeywords: {
        type: [String],
        default: [],
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
