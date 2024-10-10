# Chat App

A real-time chat application built with React and Express.js, offering personal and group messaging capabilities.

## Deployment Link

<!-- [Chat App Deployment](https://chat-app-production-0bda.up.railway.app/) -->
[Chat App Deployment](https://chat-app-umber-beta.vercel.app/)

### Credentials for Testing

- **user1@gmail.com**: 12345678
- **user2@gmail.com**: 12345678
- **user3@gmail.com**: 12345678
- **user4@gmail.com**: 12345678

##
![Chat App Interface](https://raw.githubusercontent.com/naitikraj1000/Screenshot/main/Screenshot%20from%202024-07-12%2016-27-53.png)

## Features

- Real-time messaging using Socket.io
- One-on-one personal messaging
- Group messaging with member management
- Dark mode interface
- Profile customization (profile picture, bio, etc.)
- Text and file message support
- Emoji picker
- Persistent login with access tokens
- Friend management


### Group Chat
![Group Chat](https://raw.githubusercontent.com/naitikraj1000/Screenshot/main/Screenshot%20from%202024-07-12%2016-22-12.png
)
- Create and manage group chats
- View group information and members
- Send and receive messages in real-time

### Personal Chat
![Personal Chat](https://raw.githubusercontent.com/naitikraj1000/Screenshot/main/Screenshot%20from%202024-07-12%2016-22-34.png
)
- One-on-one conversations
- File sharing capabilities
- Message status indicators

### User Profiles
![User Profile](https://raw.githubusercontent.com/naitikraj1000/Screenshot/main/Screenshot%20from%202024-07-12%2016-23-14.png
)
- Customizable user profiles with profile pictures and bios
- View and update personal information

## Technologies Used

- Frontend: React, Redux for state management
- Backend: Express.js
- Database: MongoDB
- Real-time Communication: Socket.io
- File Handling: Multer, Cloudinary
- Authentication: JWT (Access and Refresh tokens)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/naitikraj1000/Chat-App.git
   cd Chat-App
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory and fill in the following:
   ```
   PORT=
   MongoDB_URL=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=  
   CLOUDINARY_API_SECRET=
   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   ```
   Fill in the values according to your setup.

## Usage

1. Start the backend server:
   ```
   cd backend
   nodemon index.js
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Contributing

We welcome contributions to the Chat App! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request



## Contact

For any questions or feedback, please reach out to [Naitik Raj](https://www.linkedin.com/in/naitik-raj/).


---

Happy chatting! 🎉
