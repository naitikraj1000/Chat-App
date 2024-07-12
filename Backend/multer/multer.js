// multer.js
import multer from 'multer';
import { join } from 'path';
import path from 'path';

const __dirname = new URL('.', import.meta.url).pathname;


// Set up multer storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        console.log('Current Working Directory:', process.cwd());
        // Specify the directory where uploaded files will be stored
        // cb(null, "./public/uploads");
        cb(null, join(__dirname, '../public/uploads'));

    },
    filename: (req, file, cb) => {
        // Generate a unique filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create a multer instance with the storage configuration
const multer_upload = multer({ storage });

export default multer_upload;
