import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import routing from './router/routing.js';
import Connect_DB from './mongodb/mongodb_connection.js';
import mongoose from 'mongoose';



dotenv.config();
Connect_DB();

const app = express();
const server = http.createServer(app);

// Apply body-parser middleware to all routes (app.use(middleware))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Configure CORS
app.use(cors({
    origin: ['https://chat-app-umber-beta.vercel.app', 'https://chat-app-production-0bda.up.railway.app', 'http://localhost:5173'], // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Request methods to enable
    credentials: true, // Enable cookies and other credentials
}));

const io = new Server(server, {
    cors: {
        origin: '*', // WebSocket connections can still use wildcard
    }
});


let user_socket = new Map();
let socket_user = new Map();


io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on("chat message", (msg) => {
        console.log("Msg :: ", msg);

    });

    socket.on("join_server", ({ user, id }) => {

        console.log("User is Online", user.email);
        console.log("Socket ID", socket.id);

        user_socket.set(user, socket.id);
        socket_user.set(socket.id, user);

        // this user has joined the server with socket_id as id 
        // find the list of friend of this user who are online using the user_socket map (Do in Future)
        // emit the list of online friends to this user       
        let friends = [...user_socket.keys()];
        
   

        io.emit("online_friends", friends);  // Convert to array




    });



    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
        let user = socket_user.get(socket.id);
        console.log("User is Offline", user?.email);
        user_socket.delete(user);
        socket_user.delete(socket.id);

        // this user has left the server with socket_id as id
        // find the list of friend of this user who are online using the user_socket map (Do in Future)
        // emit the list of online friends to this user
        io.emit("online_friends", [...user_socket.keys()]);  // Convert to array
    });


});



// Rerendering code
// Open change streams for each model
const bioStream = mongoose.model('Bio').watch();
const friendStream = mongoose.model('Friend').watch();
const messageStream = mongoose.model('Message').watch();

// Handle changes for each model
bioStream.on('change', (change) => {
    handleBioChange(change);
});

friendStream.on('change', (change) => {
    handleFriendChange(change);
});

messageStream.on('change', (change) => {
    handleMessageChange(change);
});

// Functions to handle changes for each model
function handleBioChange(change) {
    // Emit the appropriate Socket.IO event with the updated data
    io.emit("render", 'bioUpdated');
}

function handleFriendChange(change) {
    // Emit the appropriate Socket.IO event with the updated data
    io.emit("render", 'friendUpdated');
}

function handleMessageChange(change) {
    // Emit the appropriate Socket.IO event with the updated data
    io.emit("render", 'messageUpdated');
}



app.use("/", routing);

app.get('/api', (req, res) => {
    res.send('Hello World');
});

app.post('/auth', (req, res) => {
    const refreshToken = generateRefreshToken(); // Replace with your token generation logic
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'Lax', // Adjust based on your requirements
        path: '/',
    });
    res.status(200).json({ success: "Refresh Token Valid", user: jwt.decode(refreshToken) });
});

const port = process.env.PORT || 5000;


// Because we are using socket.io, we need to use server.listen instead of app.listen
server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
