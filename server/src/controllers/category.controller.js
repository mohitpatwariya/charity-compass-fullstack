const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const addCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.body;
    if(!categoryName)
        throw new ApiError(400, 'Category name not found');
    const category = await Category.create({
        name: categoryName,
        charities: [] //initially there won't be any charties of this category
    });
    return res.status(200).json(new ApiResponse(200, category, 'Category added successfully'));
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    return res.status(200).json(new ApiResponse(200, categories, 'All categories fetched successfully'));
});

module.exports = { addCategory, getAllCategories };
