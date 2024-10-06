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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS
app.use(cors({
    // origin: 'http://localhost:5173', // Your frontend URL
    origin: ['https://chat-app-production-0bda.up.railway.app', 'http://localhost:5173','https://chat-df1vstcqu-naitikraj1000s-projects.vercel.app'], // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Request methods to enable
    credentials: true, // Enable cookies and other credentials
}));

const io = new Server(server, {
    cors: {
        origin: '*', // WebSocket connections can still use wildcard
    }
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on("chat message", (msg) => {
        console.log("Msg :: ", msg);

    });


    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
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
    io.emit("render",'bioUpdated');
}

function handleFriendChange(change) {
    // Emit the appropriate Socket.IO event with the updated data
    io.emit("render",'friendUpdated');
}

function handleMessageChange(change) {
    // Emit the appropriate Socket.IO event with the updated data
    io.emit("render",'messageUpdated');
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

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
