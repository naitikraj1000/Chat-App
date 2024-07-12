import mongoose from 'mongoose';


async function Connect_DB() {
    try {
        await mongoose.connect(process.env.MongoDB_URL,{
            serverSelectionTimeoutMS: 30000 // 30 seconds
        });
        console.log("Mongo DB Connected... ")

    } catch (error) {
        console.log("Error in Connecting MongoDB...", error);
    }
}
export default Connect_DB;