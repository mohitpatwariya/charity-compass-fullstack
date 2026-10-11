const otpGenerator = require('otp-generator');
const Otp = require('../models/otp.model');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const sendOtp = asyncHandler(async function (request, res) {
    //get the email from request body
    const { email } = request.body;
    console.log('Email received for sending otp:', email);

    //check if the user already exists
    if (await User.findOne({ email })) {
        throw new ApiError(400, 'User already exists');
    }

    //fixed OTP for development/testing
    let otp = '123456';

    //save the otp in the database
    const savedOtp = await Otp.create({
        otp,
        email
    });
    console.log('Unique otp for mail verification:', savedOtp);
    //the mail would be send on saving this

    //return successful response
    return res.status(200).json(new ApiResponse(200, { savedOtp }, 'OTP sent successfully'));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { otp,email } = req.body;

    const savedOtp = await Otp.findOne({email}).sort({createdAt: -1}).limit(1);
    if(savedOtp.otp !== otp) {
        throw new ApiError(403, 'Invalid OTP');
    }

    //remove the OTP so that it can't be reused later
    await Otp.findByIdAndDelete(savedOtp._id);
    return res.status(200).json(new ApiResponse(200, {}, 'OTP verified successfully'));
});

module.exports = { sendOtp, verifyOtp };