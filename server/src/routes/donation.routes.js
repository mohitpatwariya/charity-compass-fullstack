const { createPaymentOrder, paymentCallback } = require('../controllers/donation.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const donationRouter = require('express').Router();

donationRouter.post('/createPaymentOrder', verifyToken, createPaymentOrder);
donationRouter.post('/paymentCallback', verifyToken, paymentCallback);

module.exports = donationRouter;