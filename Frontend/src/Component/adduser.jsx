import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modechange } from "../redux/informationslice";
function Adduser() {
  const isDarkMode = useSelector((state) => {
    return state.information.isDarkMode;
  });

  const [email, setEmail] = useState("");


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddFriend = () => {
    // Handle adding friend functionality here
    console.log("Adding friend with email:", email);
    // Reset email input after adding friend
    setEmail("");
  };

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div
      className={`min-h-screen ${bgColor} w-2/5 sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/3 border-l-2 border r-2 ${borderColor}`}
    >
      <div className="mt-4 ml-4">
        {/* Back Button */}
        <button
          className={`p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none`}
          onClick={() => {
            // Handle back button click
            console.log("Back button clicked");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800 dark:text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2
            className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
          >
            Add User
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
          <form className="space-y-6" action="#" method="POST">
            {/* Email Input */}
            <div className={`block text-sm font-medium leading-6 ${textColor}`}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${bgColor} ${textColor}`}
                placeholder="Enter email address"
                value={email}
                onChange={handleEmailChange}
              />
              {/* Add Friend Button */}
              <button
                type="button"
                onClick={handleAddFriend}
                className={`mt-4 w-full rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-gray-700 hover:bg-gray-600`}
              >
                Add Friend
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Adduser;
