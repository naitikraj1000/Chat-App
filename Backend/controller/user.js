import cloudinary_upload from "../cloudinary/cloudinary.js";
import { User } from "../model/user.model.js";
import bycrypt from "bcrypt";
// this code deals with registeration of user

async function hashPassword(password) {
    return await bycrypt.hash(password, 10);
}

async function registeration(req, res) {
    // res.send(`This registeration runs fine`)
    console.log(req.body)
    // console.log("We are accessign registeration using routing ");
    const uploaded_file = await cloudinary_upload(req?.file?.path);
    // console.log(req.body,uploaded_file);

    // Now we have access to profile_link and have information about user
    // Now we have to store this information in the database
    // Then we have to send the response to the user (Notification that user is registered successfully)
    const name = req.body.name;
    const email = req.body.email;
    const password = await hashPassword(req.body.password);
    const profile_link = uploaded_file?.url ? uploaded_file.url : "https://api.multiavatar.com/Binx%20Bond.png";
    console.log(profile_link);

    // Now we have to store this information in the database
    const newUser = new User({
        name: name,
        email: email,
        password: password,
        profilePicture: profile_link

    });

    newUser.save().then((data) => {
        //  Registration Successful
        // res.status(200).json(data);
        res.send(`User Registered Successfully:: ${email}`);
        console.log("User Registered Successfully", data);

    }).catch(async (err) => {
        // res.status(500).json();
        res.send(`Error in Registeration:: ${email}`);
        console.log("Error in Registeration", err);

        // Ensure uploaded_file contains the public ID of the uploaded image
        if (uploaded_file && uploaded_file.public_id) {
            try {
                // Delete the image using its public ID
                const result = await cloudinary.uploader.destroy(uploaded_file.public_id);
                console.log('Image deleted successfully:', result);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        } else {
            console.error('No public ID found for the uploaded image');
        }
    })


}









export { hashPassword };
export default registeration;