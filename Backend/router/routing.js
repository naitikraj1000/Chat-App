import express from 'express';
import registeration from '../controller/user.js';
import multer_upload from '../multer/multer.js';
import Login from '../controller/login.js';
import jwt from 'jsonwebtoken';
import SendMessage from '../controller/message.js';
import { GetMessage } from '../controller/message.js';
import { GetFriend, SetFriend } from '../controller/friend.js';
import { GetProfile, SetProfile } from '../controller/profile.js';
import { CreateGroup,AddMemberInGroup,GetMembers } from '../controller/group.js';


const routing = express.Router();

routing.post('/register', multer_upload.single("file"), registeration);
routing.post('/signin', multer_upload.single("file"), Login);

routing.post('/auth', multer_upload.single("file"), (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      return res.send({ success: "Refresh Token Valid", user: decodedToken.user });
    } catch (error) {
      console.error("Error verifying refresh token", error);
      return res.status(403).send({ error: "Refresh Token Invalid" });
    }
  }

  return res.status(401).send({ error: "No Refresh Token Provided" });
});

routing.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Moved refreshToken declaration here

  // console.log("Refresh Token", refreshToken);

  if (refreshToken) {
    res.clearCookie('refreshToken');
  }

  return res.send({ success: "Logout Successful" });
});


routing.post('/send_msg', multer_upload.single("file"), SendMessage);
routing.post('/get_msg', multer_upload.single("file"), GetMessage);

routing.post('/get_friend', multer_upload.single("file"), GetFriend);

routing.post('/set_friend', multer_upload.single("file"), SetFriend);

routing.post('/get_profile', multer_upload.single("file"), GetProfile);

routing.post('/set_profile', multer_upload.single("file"), SetProfile);

routing.post('/set_group', multer_upload.single("file"), CreateGroup);
routing.post('/add_member', multer_upload.single("file"), AddMemberInGroup);
routing.post('/get_members', multer_upload.single("file"), GetMembers);


// routing.get('/profile', (req, res) => {
//   // code for handling profile
// });

// routing.post('/profile_update', (req, res) => {
//   // code for handling profile update
// });

// routing.get('/story', (req, res) => {
//   // code for handling story
// });

// routing.post('/story_update', (req, res) => {
//   // code for handling story update
// });



// routing.get('/msg_loading', (req, res) => {
//   // code for handling msg receive
// });

export default routing;
