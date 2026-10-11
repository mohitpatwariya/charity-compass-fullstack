const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const jwt = require('jsonwebtoken');
const Donation = require('../models/donation.model');

const registerUser = asyncHandler(async function (req, res) {
    //get the details from request
    const { username, email, password, confirmPassword } = req.body;

    //validate
    if ([username, email, password, confirmPassword].some(field => !field || field.trim() === ''))
        throw new ApiError(400, 'All fields are required');

    //check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser)
        throw new ApiError(409, 'User already exists');

    //match the passwords
    if (password !== confirmPassword)
        throw new ApiError(400, 'Passwords do not match');

    //create entry in the database
    const user = await User.create({
        username,
        email,
        password,
        savedCharities: [],
        donations: []
    });

    //remove the password and token
    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );
    if (!createdUser)
        throw new ApiError(500, 'Something went wrong while creating the user');

    console.log(user.password);
    //return the res.
    return res.status(200).json(
        new ApiResponse(201, createdUser, 'User registered successfully'),
    );
});

async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error.message || 'Something went wront while generating access and refresh tokens', [error]);
    }
}

const loginUser = asyncHandler(async (req, res) => {
    //get the details from the user
    const { email, password, rememberMe } = req.body;

    //validate
    if (!email || !password)
        throw new ApiError(400, 'All fields are required');

    //check if user exists
    const user = await User.findOne({ email });
    if (!user)
        throw new ApiError(401, 'User not registered');

    //compare the passwords
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid)
        throw new ApiError(409, 'Incorrect Password');

    //generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    //get the final user doc. that will be returned to the response
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken'); //removing the refreshToken from here because it will provided via cookie

    //return response with the cookie tokens
    const cookieOptions = {
        httpOnly: true,
        //secure: true
    }
    return res.status(200)
        .cookie('accessToken', accessToken)
        .cookie('refreshToken', refreshToken)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            refreshToken,
            accessToken
        }, 'User logged in successfully')); //if cookies are not available for some reason then we can grant the tokens through the response body
});

const logoutUser = asyncHandler(async (req, res) => {
    //logging out is just deleting it's refresh token from the database and clearing the auth cookies
    const loggedOutUser = await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, { new: true });
    console.log(loggedOutUser);

    const cookieOptions = {
        secure: true,
        httpOnly: true
    }
    return res.status(200)
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

function isLoggedIn(req, res) {
    return res.status(200)
        .json(new ApiResponse(200, {
            isLoggedIn: true
        }, 'User is logged in'));
}

const refreshToken = asyncHandler(async function (req, res) {
    //get the refresh token
    const oldRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.header('Authorization')?.refreshToken;

    //validate
    if (!oldRefreshToken)
        throw new ApiError(400, 'Refresh Token not found');

    //decode the token
    let decodedToken;
    try {
        decodedToken = await jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error('Error in refreshing token"\n', error);
        throw new ApiError(401, 'Invalid Token', error);
    }

    //get the user
    const user = await User.findById(decodedToken._id);
    if (!user)
        throw new ApiError(402, 'User corresponding to token not found(Invalid');

    //verify the user and it's token
    if (oldRefreshToken !== user.refreshToken)
        throw new ApiError(403, 'Token is either used for expired');

    //generate new access and refresh tokens for the user
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const cookieOptions = {
        httpOnly: true
    }

    //return the response and set the cookies
    return res.status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(new ApiResponse(200, {
            accessToken
        }, 'Re-Authentication successful'));
});

const getUserProfile = asyncHandler(async (req, res) => {
    const { user } = req;

    if (!user)
        throw new ApiError(400, 'User not found');

    return res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
});

const getDonations = asyncHandler(async (req, res) => {
    const { user } = req;
    const donations = [];
    for (let donationId of user.donations) {
        donations.push(await Donation.findById(donationId));
    }
    return res.status(200).json(new ApiResponse(200, donations, 'All donations fetched successfully'));
});

const updateBookmark = asyncHandler(async (req, res) => {
    const { user } = req;
    const { charityId } = req.body;

    if (!user || !charityId)
        throw new ApiError(400, 'userId or charityId not found');

    let updatedUser;
    if (!user.savedCharities.includes(charityId)) {
        updatedUser = await User.findByIdAndUpdate(user._id, {
            $push: {
                savedCharities: charityId
            }
        }, { new: true }).populate('savedCharities').exec();
    } else {
        updatedUser = await User.findByIdAndUpdate(user._id, {
            $pull: {
                savedCharities: charityId
            }
        }, { new: true }).populate('savedCharities').exec();
    }

    if (!user)
        throw new ApiError(402, 'User not found');

    return res.status(200).json(new ApiResponse(200, updatedUser, 'Bookmark updated successfully'));
});

const getSavedCharities = asyncHandler(async (req, res) => {
    const { user } = req;
    const fullUser = await User.findById(user._id)
        .populate({
            path: 'savedCharities',
            populate: [
                { path: 'address' },
                { path: 'category' }
            ]
        });
    const { savedCharities } = fullUser;
    const bookmarks = savedCharities.map(charity => {
        return {
            ...charity.toObject(),
            bookmarked: true
        }
    });
    return res.status(200).json(new ApiResponse(200, bookmarks, 'Bookmarked charities fetched successfully'));
});

const getTotalDonation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('donations');
    const totalDonation = user.donations.reduce((ac, cv) => ac + cv.amount, 0);
    return res.status(200).json(new ApiResponse(200, { totalDonation }, 'Total contribution fetched successfully'));
});

module.exports = { registerUser, loginUser, logoutUser, isLoggedIn, refreshToken, getUserProfile, getDonations, updateBookmark, getSavedCharities, getTotalDonation };