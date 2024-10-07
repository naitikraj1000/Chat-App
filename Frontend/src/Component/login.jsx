import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./notfication"
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {
  authchange,
  modechange,
  userchange,
} from "../redux/informationslice";
import logo from "../assets/logo.png";

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(
    useSelector((state) => {
      return state.information.isDarkMode;
    })
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [responseMessage, setResponseMessage] = useState("");

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const inputBgColor = isDarkMode
    ? "bg-gray-700 text-white"
    : "bg-white text-gray-900";
  const buttonBgColor = isDarkMode
    ? "bg-indigo-800 hover:bg-indigo-700"
    : "bg-indigo-600 hover:bg-indigo-500";
  const linkColor = isDarkMode
    ? "text-indigo-400 hover:text-indigo-300"
    : "text-indigo-600 hover:text-indigo-500";

  const toggleDarkMode = () => {
    dispatch(modechange(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  };

  function handleSubmit(event) {
    event.preventDefault();

    // hey this uis test
    
    const form = new FormData(event.target);
    const email = form.get("email");
    const password = form.get("password");

    console.log(email, password, `${import.meta.env.VITE_BACKEND_URL}/signin`);


    axios.post(`${import.meta.env.VITE_BACKEND_URL}/signin`, form, {
      withCredentials: true, // Ensure credentials (like cookies) are included
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      const msg = response.data;
      console.log("Response from the server", msg);
      if (msg.error) {
        console.log("Error in Signin User", msg.error);
        setResponseMessage({ msg: msg.error, date: new Date() }); // Update the state with the new message
        return;
      } else {
        setResponseMessage({ msg: msg.success, date: new Date() }); // Update the state with the new message
        console.log("Login Successful", msg);
        // Make auth true and store the user information in the Slice (Redux) so that we can access it from anywhere
        dispatch(userchange(msg.user));
        dispatch(authchange(true));
        // console.log("User Information", msg.user);
        navigate("/");
      }
    })
    .catch(error => {
      console.log("Error in Signin User from Client Side", error);
    });
  }

  return (
    <>
      {<Notification message={responseMessage} />}

      <div className={`min-h-screen ${bgColor}`}>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <button
            className="p-2 rounded-full transition-colors duration-300 focus:outline-none"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

  

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          
          <img
              className="mx-auto h-10 w-auto"
              style={{ borderRadius: '50%', height: '40px', width: '40px' }}
              src={logo}
              alt="chat_app logo"
            />
            <h2
              className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
            >
              Sign in to your account
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium leading-6 ${textColor}`}
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${inputBgColor}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium leading-6 ${textColor}`}
                  >
                    Password
                  </label>
                  {/* <div className="text-sm">
                    <Link to="" className={`font-semibold ${linkColor}`}>
                      Forgot password?
                    </Link>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${inputBgColor}`}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonBgColor}`}
                >
                  Sign in
                </button>
              </div>
            </form>
            <p className={`mt-10 text-center text-sm ${textColor}`}>
              <Link
                to="/register"
                className={`font-semibold leading-6 ${linkColor}`}
              >
                Register
              </Link>
            </p>
          </div>
          <div className="mt-4 flex justify-end"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
