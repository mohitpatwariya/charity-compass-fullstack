const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

//AuthN
const authN = asyncHandler(async function(req, res, next) {
    //get the refresh token from user
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.header('Authorization')?.replace('Bearer ','');

    //validate the token
    if(!refreshToken)
        throw new ApiError(401, 'Refresh Token not found');

    //decode the token
    let decodedToken;
    try {
        decodedToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch(error) {
        console.error('Error in verifying refresh token\n',error);
        throw new ApiError(402, 'Invalid Token', error);
    }

    //get the user from DB
    const user = await User.findById(decodedToken._id);

    //verify the token
    if(!user) 
        throw new ApiError(403, 'User corresponding to token not found (Invalid)');

    //check if both tokens match
    if(user.refreshToken !== refreshToken)
        throw new ApiError(403, 'Token expired or already used');

    //call next MW
    next();
}); 

//AuthZ
const verifyToken = asyncHandler(async function (req, res, next) {
    //get the access token
    console.log(req.cookies);
    const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    //req.header('Authorization') is same as req.headers['Authorization']
    // console.log(accessToken);

    //validate the token
    if (!accessToken)
        throw new ApiError(401, 'Access token not found');

    //decode the token
    const decodedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    //get the user 
    const user = await User.findById(decodedToken._id).select('-password -refreshToken');

    //Verify the token
    if (!user)
        throw new ApiError(402, 'Invalid Access Token');

    //append the user to the request object
    req.user = user;

    //call the next MW in stack
    next();
});

module.exports = { authN, verifyToken };