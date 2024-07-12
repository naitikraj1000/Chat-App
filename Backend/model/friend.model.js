import mongoose from "mongoose";

// const friendSchema = new mongoose.Schema({
//     user: {
//         _id:{type:String,required:true},
//         email: { type: String, required: true },
//         name: { type: String, required: true },
//         profile_link: { type: String }
//     },
//     friends: [{
//         user: {
//             _id:{type:String,required:true},
//             email: { type: String, required: true },
//             name: { type: String, required: true },
//             profile_link: { type: String }
//         }
//     }]
// });


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
