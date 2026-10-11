const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Charity = require('../models/charity.model')
const Category = require('../models/category.model');
const User = require('../models/user.model');
const Address = require('../models/address.model');
const mongoose = require('mongoose');
// const Address = require('../models/address.model');

const registerCharity = asyncHandler(async (req, res) => {
    //get the details from req
    const {
        name,
        description,
        website,
        category,
        address, //nested object
        donationLink,
    } = req.body;

    //validate
    if ([name, description, website, category, donationLink].some(key => !key || key.trim() === '') || !address)
        throw new ApiError(400, 'All fields are required');

    //get the owner i.e. the user registering this charity
    const owner = req.user;

    //verify the category
    const registeredCategory = await Category.findOne({ name: category });
    if (!registeredCategory)
        throw new ApiError(403, 'Category not available');

    //create the address
    const charityAddress = await Address.create(address);

    //create the charity
    const charity = await Charity.create({
        name,
        description,
        website,
        donationLink,
        category: registeredCategory._id,
        address: charityAddress._id,
        owner: owner._id
    });

    //add the charity to the respective category
    registeredCategory.charities.push(charity._id);
    await registeredCategory.save();

    //return the reponse
    return res.status(200).json(new ApiResponse(200, charity, 'Charity registered successfully'));
});

const getCharityByCategory = asyncHandler(async (req, res) => {
    //get the category name from req.
    const { categoryName } = req.body;
    const { user } = req;
    let charities = [];
    //validate
    if (!categoryName || categoryName.trim() === '') {
        charities = await Charity.find({}).populate('address').populate('category').exec();
        charities = charities.map(charity => {
            return {
                ...charity.toObject(), // Convert the Mongoose document to a plain JavaScript object
                bookmarked: user.savedCharities.includes(charity._id) // Add the new field 'bookmark' and set its initial value to false
            };
        });
    } else {
        //find the category corresponding to that name
        const category = await Category.findOne({ name: categoryName });
        if (!category)
            throw new ApiError(402, 'Invalid Category');

        //get all the charities of that category
        const { user } = req;
        for (let charityId of category.charities) {
            const charity = await Charity.findById(charityId).populate('address').populate('category').exec();
            const updatedCharity = charity.toObject(); 
            updatedCharity.bookmarked = user.savedCharities.includes(charityId);
            charities.push(updatedCharity);
        }
    }

    //return the charities in response
    return res.status(200).json(new ApiResponse(200, charities, 'Required charities fetched successfully'));
});

const getCharityById = asyncHandler(async (req, res) => {
    //get the charity id
    const { id } = req.params;

    //validate
    if (!id)
        throw new ApiError(400, 'Charity id not found');

    //get the charity
    const charity = await Charity.findById(id).populate('address').populate('category').exec();
    if (!charity)
        throw new ApiError(400, 'Charity corresponding to that id not found');

    const { user } = req;
    const fullCharity = {
        ...charity.toObject(),
        bookmarked: user.savedCharities.includes(charity._id)
    }

    //return the response
    return res.status(200).json(new ApiResponse(200, fullCharity, 'Charity fetched successfully'));
});

module.exports = { registerCharity, getCharityByCategory, getCharityById };