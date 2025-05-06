const  cloudinary  = require("./cloudinaryConfig");
const fs = require('fs');
const path = require('path');


const uploadCoudinary = async(part)=>{
    console.log('in uploadCoudinary', part);
    const tempDir = path.join(__dirname, "tmp");

    // Ensure tmp directory exists
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, part.filename);

    // Write the file stream to the tmp directory
    await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        part.file.pipe(writeStream);
        part.file.on("error", reject);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
    });

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "lokjyot_news_images",
        });

        fs.unlinkSync(filePath); // Delete temp file
        return result.secure_url;
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        throw new Error("Upload failed");
    }
  
}

module.exports = uploadCoudinary