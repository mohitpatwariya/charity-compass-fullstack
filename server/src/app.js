const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//create an instance of express server
const app = express();

//Just mount the middlewares here
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: '16kb'
}));

app.use(express.urlencoded({
    limit: '16kb',
    extended: true
}));

app.use(express.static('public'));

app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/public/tmp/'
}));

//test route for file uplaod
const uploadOnCloudinary = require('./utils/cloudinary');
app.post('/api/testUpload', async (req, res) => {
    const uploadedFile = req.files.file;
    console.log('File uploaded by user:\n',uploadedFile);
    const result = await uploadOnCloudinary(uploadedFile.tempFilePath);
    res.status(200).json({result});
})

//default route
app.get('/', (req, res) => res.send('Welcome to charity finder'));

//mount API routes
const userRouter = require('./routes/user.routes');
app.use('/api/users', userRouter);

const categoryRouter = require('./routes/category.routes');
app.use('/api/category', categoryRouter);

const charityRouter = require('./routes/charity.routes');
app.use('/api/charity', charityRouter);

const donationRouter = require('./routes/donation.routes');
app.use('/api/donation', donationRouter);

const otpRouter = require('./routes/otp.routes');
app.use('/api/otp', otpRouter);

module.exports = app;