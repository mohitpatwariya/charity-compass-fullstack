const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    //the address will either point to a user or to a charity
    district: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    pincode: {
        type: Number,
        required: true
    },
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;