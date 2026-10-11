const { sendOtp, verifyOtp } = require('../controllers/otp.controller');

const otpRouter = require('express').Router();

otpRouter.post('/sendOtp', sendOtp);
otpRouter.post('/verifyOtp', verifyOtp);

module.exports = otpRouter;