const mongoose = require('mongoose');
const User = require('./user.model');
const Charity = require('./charity.model');
const mailSender = require('../utils/nodemailer');
const donationHtml = require('../utils/template');

const donationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    charity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charity',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    }
});

async function getUserEmail(userId) {
    const user = await User.findById(userId);
    const email = user.email;
    return email;
}

donationSchema.post('save', async function (doc) {
    const user = await User.findById(doc.user);
    const charity = await Charity.findById(doc.charity);
    try {
        await mailSender(user.email, 'Charity Donation', donationHtml(user.username, doc.amount, charity.name));
        console.log('Donation mail sent successfully');
    } catch (error) {
        console.error('Error sending donation email:', error);
    }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;