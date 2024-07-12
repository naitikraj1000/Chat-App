import React from "react";
import { useState } from "react";
import Filehandler from "../../utility/filehandler";
import { useDispatch, useSelector } from "react-redux";
import { modechange } from "../redux/informationslice";
function Status({ loadstatus, setLoadstatus }) {
  const isDarkMode = useSelector((state) => {
    return state.information.isDarkMode;
  });
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const [objmsg, setObjmsg] = useState();
  const user_name=useSelector(state => state.information.user.name);
  const user_email=useSelector(state => state.information.user.email);
  return (
    <div className="min-h-screen w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 border-l-2 border-r-2 border-gray-300">
      <div className={`h-full ${bgColor} overflow-hidden`}>
        {/* Back Button */}
        <div
          className="mt-4 ml-4"
          onClick={() => setLoadstatus((prev) => !prev)}
        >
          <button
            className={`p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none`}
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

        {/* Status List */}
        <div
          className={`h-full overflow-y-auto ${textColor} px-6 py-12 lg:px-8`}
        >
          {/* My Status */}
          <h2
            className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
          >
            My Status
          </h2>
          <div className="flex flex-wrap justify-center py-4">
            {/* My Status Card */}
            <div className="w-64 border border-gray-300 rounded-lg m-4 relative flex items-center justify-center">
              <div
                className="w-14 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600"
                onClick={() => {
                  Filehandler((selectedFiles) => {
                    const file = selectedFiles[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setObjmsg(reader.result);
                        // console.log(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  });
                }}
              >
                <img
                  // src="https://api.multiavatar.com/Binx%20Bond.png"
                  src={objmsg || `https://api.multiavatar.com/Binx%20Bond.png`}
                  alt="My Avatar"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>

              <p className="ml-2">{user_name}</p>
            </div>
          </div>

          {/* Horizontal Boundary */}
          <hr className="my-8 border-t border-gray-300" />

          {/* Users' Status */}
          <h2 className={`text-xl font-semibold my-4 text-center ${textColor}`}>
            Users' Status
          </h2>
          {/* Users' Status Cards */}
          <div className="flex flex-wrap justify-center">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-64 border border-gray-300 rounded-lg m-4"
              >
                <div className="flex items-center p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                    <img
                      src="https://api.multiavatar.com/Binx%20Bond.png"
                      alt={`User ${index + 1}`}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">User {index + 1}</p>
                    <p>Status: Active</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Status;
