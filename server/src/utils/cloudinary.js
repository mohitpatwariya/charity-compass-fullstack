const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY
});

//assuming that the file has been uploaded on server locally using express-fileupload or multer
async function uploadOnCloudinary(localFilePath) {//the function returns null if the upload fails or else it returns the uploaded resource
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: 'test',
            resource_type: 'auto'
        });
        console.log('File uploaded on cloudinary:\n',response.url);
        return response;
    } catch(error) {
        console.error('Error in uploading file to cloudinary:\n',error);
        //remove the file locally from the server
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports = uploadOnCloudinary;