const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    ifscCode: {
        type: String,
        trim: true,
        required: true
    },
    accountNumber: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model(bankSchema, 'Bank');