import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { modechange } from "../redux/informationslice";
import Notification from "./notfication";
function Registration() {
  // console.log(`${import.meta.env.VITE_BACKEND_URL}/register`);
  // `${import.meta.env.VITE_BACKEND_URL}/register`}
  const [isDarkMode, setIsDarkMode] = useState(
    useSelector((state) => {
      return state.information.isDarkMode;
    })
  );

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

  const [selectedImage, setSelectedImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    dispatch(modechange(!isDarkMode));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        // console.log(file);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setResponseMessage({
        msg: "Passwords do not match",
        date: new Date(),
      });
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      method: "POST",
      body: form,
    })
      .then(async (response) => {
        // Handle the response from the server

        const msg = await response.text();
        setResponseMessage({ msg: msg, date: new Date() }); // Update the state with the new message
        console.log({ msg: msg, date: new Date() });
        console.log("Form Submitted");
        navigate("/");
      })
      .catch((error) => {
        // Handle any errors

        console.log("Error in Regestering User from Client Side", error);
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
            <h2
              className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
            >
              Registration
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
              {/* Image Loading Code */}

              <div className="flex justify-center">
                <label htmlFor="photo" className="relative inline-block">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <img
                        src="https://api.multiavatar.com/pirates.svg"
                        alt="Default"
                        className="object-cover w-full h-full rounded-full"
                      />
                    )}
                  </div>

                  <input
                    id="photo"
                    name="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Other Things in the form */}
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium leading-6 ${textColor}`}
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${inputBgColor}`}
                  />
                </div>
              </div>
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
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium leading-6 ${textColor}`}
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${inputBgColor}`}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium leading-6 ${textColor}`}
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
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
                  Register
                </button>
              </div>
            </form>

            <p className={`mt-10 text-center text-sm ${textColor}`}>
              <Link to="/" className={`font-semibold leading-6 ${linkColor}`}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
