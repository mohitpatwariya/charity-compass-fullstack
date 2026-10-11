const mongoose = require('mongoose');
const mailSender = require('../utils/nodemailer');
const { emailVerificationHtml } = require('../utils/template');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String, //it can consist of characters
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        //this would be used for sorting the otp's
        type: Date,
        required: true,
        default: Date.now, //this might cause error?
        expires: 5*60
    }
});

otpSchema.pre('save', async function (next) {
    // Skip sending mail if SMTP credentials aren't configured (dev mode).
    // The OTP is logged in the controller so it can still be used for testing.
    if (!process.env.USER_MAIL || !process.env.USER_PASS) {
        console.warn(`[otp] SMTP not configured; skipping email. OTP for ${this.email}: ${this.otp}`);
        return;
    }

    try {
        const mailResponse = await mailSender(
            this.email,
            'Email Verification',
            emailVerificationHtml(this.otp)
        );
        console.log('Email verification mail sent successfully:\n', mailResponse);
    } catch (error) {
        // Don't block OTP creation on mail failure; log so the OTP is still usable for testing.
        console.error(`[otp] Failed to send verification email to ${this.email}:`, error.message);
        console.warn(`[otp] OTP for ${this.email}: ${this.otp}`);
    }
});

module.exports = mongoose.model('otpModel', otpSchema);