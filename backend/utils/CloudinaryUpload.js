const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = (buffer, folder = "productImages") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder},
            (error, result) => {
                if(error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

module.exports = uploadToCloudinary;