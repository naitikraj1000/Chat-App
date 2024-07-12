import { Bio } from "../model/bio.model.js";
import { User } from "../model/user.model.js";
import { Group } from "../model/grp.model.js";
import cloudinary_upload from "../cloudinary/cloudinary.js";

async function SetProfile(req, res) {
    const { user, bio } = req?.body;
    const userObject = user ? JSON.parse(user) : {};

    const file_path = req?.file?.path;


    const newBio = new Bio({
        user: userObject,
        bio: bio
    });

    if (file_path) {

        const upload_url = await cloudinary_upload(file_path);

        if (!upload_url) {
            console.log("Error in Updating User Profile Cloudinary Failed to Upload");
        }
        // update the user profile

        try {

            const response = await User.findByIdAndUpdate(
                userObject._id,
                { $set: { profilePicture: upload_url?.url } },
                { new: true, useFindAndModify: false }
            )

            if(!response){
                // It is group so update the profile picture in Group Model
                const groupResponse= await Group.findByIdAndUpdate(
                    userObject._id,
                    { $set: { profilePicture: upload_url?.url } },
                    { new: true, useFindAndModify: false }
                )
            }

            

            // console.log(" URL ",response);


            console.log("USER/Group PROFILE UPDATED");
        } catch (error) {

            console.log("Error in Updating User Profile", error);
        }

    }

    if (bio) {
        Bio.findOneAndUpdate(
            { 'user._id': userObject._id },
            { $set: { bio: bio } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
            .then((data) => {
                if (data) {
                    res.status(200).json({ message: 'Bio updated' });
                    console.log("Bio Updated Successfully in Database");
                } else {
                    // If no document was found and updated, create a new one
                    const newBio = new Bio({
                        user: { _id: userObject._id },
                        bio: bio
                    });
                    return newBio.save();
                }
            })
            .then((newData) => {
                if (newData) {
                    res.status(201).json({ message: 'New bio created' });
                    console.log("New Bio Created Successfully in Database");
                }
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error in Setting Profile' });
                console.log("Error in Saving/Updating Bio to Database", err);
            });
    }

}




async function GetProfile(req, res) {
    const { user } = req.body;
    const userObject = user ? JSON.parse(user) : {};


    //  For This i have to just return the bio of the user as  Profile links are already delievered by User Model
    
    Bio.findOne({ user: userObject })
        .then((data) => {
            res.status(200).json({ message: 'Bio received', bio: data });
            console.log("Bio fetched Successfully from Database");
        })
        .catch((err) => {
            res.status(500).json();
            console.log("Error in fetching Bio from Database", err);
        });
}

export { SetProfile, GetProfile };
