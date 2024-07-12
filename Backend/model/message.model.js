import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: Object,
        required: true
    },
    msg: {
        type: String,
    },
    file: {
        type: Object,
    },
    date: {
        type: String,
    },
    receiver: {
        type: Object,
        required: true
    },
});

export const Message = mongoose.model("Message", messageSchema);
