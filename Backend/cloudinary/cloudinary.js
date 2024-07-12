import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



async function cloudinary_upload(filepath) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
   

    if(!filepath){
        console.log(`No File Path Provided to Upload to Cloudinary`);
        return;
    }


    // Upload the file to Cloudinary
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            resource_type: 'auto', 
            folder: "Chat_App",
            // public_id:
        });
        console.log(`Media Files Uploaded to Cloudinary`, result);
        // Delete the file from the server

        fs.unlinkSync(filepath);
        console.log(`File Deleted from the server`);


        return result;
    } catch (error) {
        console.log(`Error Uploading Media Files to Cloudinary`, error);
        // Delete the file from the server

        fs.unlinkSync(filepath);
        console.log(`File Deleted from the server`);

    }



}


export default cloudinary_upload;