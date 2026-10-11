const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const Donation = require('../models/donation.model');
const razorpay = require('../utils/razorpay');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const Charity = require('../models/charity.model');
const crypto = require("crypto");

const createPaymentOrder = asyncHandler(async (req, res) => {
    const { amount, currency } = req.body;

    // Create an order in Razorpay
    const options = {
        amount: amount * 100, // Amount in the smallest currency unit
        currency,
        receipt: crypto.randomBytes(10).toString("hex"),
    };

    const response = await razorpay.orders.create(options);
    console.log(response);
    res.status(200).json(new ApiResponse(200, {
        orderId: response.id,
        amount: response.amount,
        currency: response.currency,
        receipt: response.receipt
    }, 'Payment Order created successfully'));
});

const paymentCallback = asyncHandler(async (req, res) => {
    //verify the payment
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, charityId } =
        req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign.toString())
        .digest("hex");
        console.log(expectedSign);

    if (razorpay_signature !== expectedSign) {
        throw new ApiError(401, 'Invalid razorpay signature');
    }

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    //create the donation
    const donation = await Donation.create({
        user: req.user._id,
        charity: charityId,
        paymentId: razorpay_payment_id,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.method,
    });

    //update the donation in the user
    const user = await User.findByIdAndUpdate(req.user._id, {
        $push: {
            donations: donation._id
        }
    }, { new: true });

    //update the charity funds
    const charity = await Charity.findByIdAndUpdate(charityId, {
        $push: {
            funds: donation._id
        }
    }, { new: true });

    return res.status(200).json(new ApiResponse(200, donation, 'Donation verified and registered successfully'));
});

module.exports = { createPaymentOrder, paymentCallback };