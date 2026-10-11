const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
        maxLength: 20
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    website: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    banks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bank'
        }
    ],
    donationLink: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    funds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        }
    ],
    image: {
        type: String,
    }
}, { timestamps: true });

const Charity = mongoose.model('Charity', charitySchema);
module.exports = Charity;