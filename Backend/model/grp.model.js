import mongoose, { Schema } from "mongoose";


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, profilePicture: {
        type: String,
        default: 'https://api.multiavatar.com/Binx%20Bond.png',
    }
}, {
    timestamps: true,
},
);

export const Group = mongoose.model("Group", groupSchema)