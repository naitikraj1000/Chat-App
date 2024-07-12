import { Message } from "../model/message.model.js";
import cloudinary_upload from "../cloudinary/cloudinary.js";
import moment from 'moment';

async function SendMessage(req, res) {
    const { sender, msg, date, receiver } = req?.body || {};
    const file = req?.file; // The uploaded file
    const senderObject = sender ? JSON.parse(sender) : {}; // Parse the user JSON string with fallback to empty object
    const receiverObject = receiver ? JSON.parse(receiver) : {}; // Parse the user JSON string with fallback to empty object

    console.log('User:', senderObject);
    console.log('Message:', msg);
    console.log('Date:', date);
    console.log('File:', file);

    let uploaded_url = "";
    let fileData = {};

    if (file) {
        uploaded_url = (await cloudinary_upload(req?.file?.path))?.url || "";
        fileData = {
            name: file.originalname || "",
            type: file.mimetype || "",
            size: file.size || 0,
            url: uploaded_url,
        };
    }

    // sender: {id:" objectid1", email: "pirates10001@gmail.com", name: "Pirates" }

    const newMessage = new Message({
        sender: senderObject,
        msg: msg || "",
        file: fileData,
        date: date || "",
        receiver: receiverObject,
    });



    newMessage
        .save()
        .then((data) => {
            res.status(200).json({ message: 'Message received', url: uploaded_url });
            console.log("Message Saved Successfully to Database");
        })
        .catch((err) => {
            res.status(500).json();
            console.log("Error in Saving Message to Database", err);
        });
}


async function GetMessage(req, res) {

    const { user, chatuser, isgrp } = req?.body || {};
    const userObject = user ? JSON.parse(user) : {};
    const chatuserObject = chatuser ? JSON.parse(chatuser) : {};

    if (userObject == {} || chatuserObject == {}) {
        res.status(500).json();
        console.log("Error in Fetching Messages user and chatuserobject are required");
    }

    // console.log('User:', userObject);
    // console.log('Chat User:', chatuserObject);
    // we want both types of messages to be fetched
    // Fetch messages sent by the user to chatuserObject
    // Fetch messages received by the user from chatuserObject
    // Combine both types of messages
    // Sort the combined messages by date
    // Return the combined and sorted messages



    function parseDate(dateString) {
        // Print the input date string for debugging
        // console.log(`Parsing date string: ${dateString}`);

        const temp = moment(dateString, "MM/DD/YYYY, h:mm:ss A", true);
        // console.log('Moment Object:', temp);

        if (temp.isValid()) {
            // console.log('Parsed Date:', temp.toDate());
            return temp.toDate();
        } else {
            console.error(`Invalid date format: ${dateString}`);
            return null;
        }
    }


    try {

        
        // console.log("isgrp", isgrp,typeof(isgrp));
        if (isgrp=='false') {
            // we are fetching message usign document_id and that's correct way to fetch data
            const messagesSentByUser = await Message.find({ 'sender._id': userObject._id, 'receiver._id': chatuserObject._id });
            const messagesReceivedByUser = await Message.find({ 'sender._id': chatuserObject._id, 'receiver._id': userObject._id });
            const allMessages = [...messagesSentByUser, ...messagesReceivedByUser];
            const sortedMessages = allMessages.sort((a, b) => {
                return parseDate(a.date) - parseDate(b.date);
            });

            res.status(200).json(sortedMessages);
        } else {
            // this is grp msg so extract all the message whose receiver is chatuserObject
            const allMessages = await Message.find({ 'receiver._id': chatuserObject._id });
            const sortedMessages = allMessages.sort((a, b) => {
                return parseDate(a.date) - parseDate(b.date);
            });

            res.status(200).json(sortedMessages);
        }


        console.log("Messages Fetched Successfully");
    } catch (error) {
        res.status(500).json();
        console.log("Error in Fetching Messages", error);
    }

}
export default SendMessage;
export { GetMessage };
