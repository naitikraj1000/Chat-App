import mongoose from "mongoose";


const bioSchema = new mongoose.Schema({

    user: {
        _id: {
            type: String,
            required: true
        }
    },
    bio: {
        type: String,
        default: ""
    },
});



export const Bio = mongoose.model("Bio", bioSchema);