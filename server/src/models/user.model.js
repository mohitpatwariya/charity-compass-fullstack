const mongoose = require('mongoose');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    refreshToken: {
        type: String
    },
    savedCharities: [ //bookmarks
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Charity'
        },
    ],
    donations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        }
    ],
    createdCharities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Charity'
        }
    ],
    image: {
        type: String
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        try {
            this.password = await hashPassword(this.password);
        } catch(error) {
            console.error('Error in hashing password:\n',error);
            throw error;
        }
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
} //this method will be used when user logs in!

userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            savedCharities: this.savedCharities
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

const User = mongoose.model('User', userSchema);
module.exports = User;