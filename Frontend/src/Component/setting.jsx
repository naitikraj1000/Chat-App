import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { modechange,authchange,userchange } from "../redux/informationslice";
import { useNavigate } from "react-router-dom";
function Setting({ loadsetting, setLoadsetting }) {
  const isDarkMode = useSelector((state) => {
    return state.information.isDarkMode;
  });
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const buttonBgColor = isDarkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-indigo-600 hover:bg-indigo-500";
  const linkColor = isDarkMode
    ? "text-indigo-400 hover:text-indigo-300"
    : "text-indigo-600 hover:text-indigo-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const navigate = useNavigate(); // Hook for navigating in React Router
   const dispatch = useDispatch();
  async function handleLogout() {

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const msg = await response.json();
      console.log("Response from the server", msg);
      dispatch(authchange(false));
      dispatch(userchange({}));
      navigate("/"); // Corrected typo
    } catch (error) {
      // Handle fetch errors
      console.error("Error in Logout", error);
    }
  }

  return (
    <div
      className={`min-h-screen ${bgColor} w-2/5 sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/3 border-l-2 border r-2 ${borderColor}`}
    >
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div
          className="absolute top-0 left-0 mt-6 ml-6"
          onClick={() => setLoadsetting((prev) => !prev)}
        >
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2
            className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
          >
            Settings
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="space-y-6">
            <button
              className={`w-full flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19.25v-3.5a2.25 2.25 0 012.25-2.25H16M15 6h2a2 2 0 012 2v10a2 2 0 01-2 2h-2M9 6h2a2 2 0 012 2v10a2 2 0 01-2 2H9m6-18v3M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                ></path>
              </svg>
              Profile
            </button>

            <button
              className={`w-full flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              Log Out
            </button>

            <button
              className={`w-full flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12a8 8 0 11-16 0 8 8 0 0116 0zm-8 3v3m0-10V7"
                ></path>
              </svg>
              About
            </button>
            <button
              className={`w-full flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              Delete Account
            </button>
            <button
              className={`w-full flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
