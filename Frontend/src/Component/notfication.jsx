import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Notification({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  const isDarkMode = useSelector((state) => state.information.isDarkMode);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  if (!message) return null;

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  return (
    <>
      {isVisible && (
        <div className={`fixed top-0 left-0 right-0 z-50 p-4 text-center ${bgColor} ${textColor}`}>
          {message.msg}
        </div>
      )}
    </>
  );
}

export default Notification;
