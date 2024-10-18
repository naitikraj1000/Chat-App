import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create a context for the socket
const SocketContext = createContext(null);

// Custom hook to use the socket
export const useSocket = () => {
    return useContext(SocketContext);
};

// SocketProvider component to provide the socket to your application
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize the socket connection on mount
        const socketInstance = io(import.meta.env.VITE_BACKEND_URL);  // Replace with your backend URL
        setSocket(socketInstance);

        // Cleanup: Disconnect the socket when the component unmounts
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
