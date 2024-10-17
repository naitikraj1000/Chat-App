import mongoose, { Schema } from "mongoose";




const friendSchema = new mongoose.Schema({
    user: {
        _id: { type: String, required: true },
    },
    friends: [{
        user: {
            _id: { type: String, required: true },
        }
    }]
});


export const Friend = mongoose.model("Friend", friendSchema);
