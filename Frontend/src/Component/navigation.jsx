import React, { useEffect, useMemo, useState } from "react";
import Profile from "./profile";
import Setting from "./setting";
import Info from "./info";
import Notification from "./notfication";
import Adduser from "./adduser";
import Status from "./status";
import MessageComponent from "./message";
import UserComponent from "./user";
import { useDispatch, useSelector } from "react-redux";
import { modechange, rerenderchange } from "../redux/informationslice";
import io from "socket.io-client";

const NavigationComponent = ({
  loadprofile,
  setLoadprofile,
  loadstatus,
  setLoadstatus,
  loadsetting,
  setLoadsetting,
}) => {
  const [showFriendBox, setshowFriendBox] = useState(false);
  const [addFriendemail, setAddFriendemail] = useState("");
  const [isGroupChecked, setIsGroupChecked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    useSelector((state) => {
      return state.information.isDarkMode;
    })
  );
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    // console.log("Toggling Dark Mode");
    dispatch(modechange(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  };

  const user = useSelector((state) => {
    return state.information.user;
  });






  async function handleAddFriend() {
    setshowFriendBox(false);
    let email = addFriendemail;
    setAddFriendemail("");
    console.log("Adding friend with email:", email);

    // Add Friend Logic connecting backend

    const formData = new FormData();
    formData.append("user", JSON.stringify({ _id: user._id }));
    formData.append("friend_email", email);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/set_friend`,
        {
          method: "POST",
          body: formData,
        }
      );
      const res = await response.json();

      if (res.success) {
        console.log("Friend Added Successfully", res.friends);
      } else {
        console.log("Error in Adding Friend", res.error);
      }
    } catch (error) {
      console.error("Error in Adding Friend", error);
    }
  }

  async function handleAddGroup() {
    setshowFriendBox(false);
    let grp_name = addFriendemail;
    setAddFriendemail("");

    const formData = new FormData();
    formData.append("name", grp_name);
    formData.append("members", [user._id]);
    formData.append("admin", user._id);

    console.log("Adding Group with name:", grp_name);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/set_group`,
        {
          method: "POST",
          body: formData,
        }
      );
      const res = await response.json();

      if (response.ok) {
        console.log("Group Added Successfully", res);
        // You might want to update your UI or state here
      } else {
        console.log(
          "Error in Adding Group",
          res.error || "Unknown error occurred"
        );
      }
    } catch (error) {
      console.error("Error in Adding Group", error);
    }
  }

  const iconColor = isDarkMode
    ? "text-gray-300 hover:text-white transition-colors duration-300"
    : "text-gray-800 hover:text-black transition-colors duration-300";
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div
      className={`flex flex-col h-screen ${bgColor} w-16 fixed top-0 left-0 overflow-hidden border-r-2 ${borderColor} md:w-20 lg:w-24`}
    >
      <div
        className="flex flex-col items-center mt-10 space-y-4"
        id="navigation_notification"
      >
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

        {/* notification */}
        <button
          className={`${iconColor} p-2 rounded-full transition-colors duration-300`}
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* online status */}
        <button
          className={`${iconColor} p-2 rounded-full transition-colors duration-300`}
          id="navigation_status"
          onClick={() => setLoadstatus((prev) => !prev)}
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
              d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>

        {/* Add Friend */}
        <button
          className={`${iconColor} p-2 rounded-full transition-colors duration-300`}
          onClick={() => setshowFriendBox(true)}
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>

        {/* Add Email Dialog */}
        {showFriendBox && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`${bgColor} ${borderColor} p-6 rounded-lg shadow-lg`}
            >
              <h2 className={`text-xl font-bold ${iconColor} mb-4`}>
                {isGroupChecked ? "Add Group" : "Add Email Address"}
              </h2>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="groupCheckbox"
                  checked={isGroupChecked}
                  onChange={(e) => setIsGroupChecked(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="groupCheckbox" className={`${iconColor}`}>
                  Add Group
                </label>
              </div>

              {isGroupChecked ? (
                <input
                  type="text"
                  placeholder="Enter group name"
                  onChange={(e) => setAddFriendemail(e.target.value)}
                  className={`${bgColor} ${borderColor} p-2 rounded-md mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                />
              ) : (
                <input
                  type="email"
                  placeholder="Enter email address"
                  onChange={(e) => setAddFriendemail(e.target.value)}
                  className={`${bgColor} ${borderColor} p-2 rounded-md mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                />
              )}

              <div className="flex justify-end">
                <button
                  className={`${bgColor} ${borderColor} ${iconColor} px-4 py-2 rounded-md mr-2`}
                  onClick={() => setshowFriendBox(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${bgColor} ${borderColor} ${iconColor} px-4 py-2 rounded-md`}
                  onClick={() => {
                    if (isGroupChecked) {
                      handleAddGroup();
                    } else {
                      handleAddFriend();
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center mb-10 space-y-4">
        {/* setting */}
        <button
          className={`${iconColor} p-2 rounded-full transition-colors duration-300`}
          id="navigation_setting"
          onClick={() => setLoadsetting((prev) => !prev)}
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* profile image */}
        <button
          className={`${iconColor} p-2 rounded-full transition-colors duration-300`}
          id="navigation_profile"
          onClick={() => setLoadprofile((prev) => !prev)}
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
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loadinfo, setLoadinfo] = useState(false);
  const [loadprofile, setLoadprofile] = useState(false);
  const [loadsetting, setLoadsetting] = useState(false);
  const [loadstatus, setLoadstatus] = useState(false);

  return (
    <div className="flex h-screen">
      {loadprofile ? (
        <Profile
          isDarkMode={isDarkMode}
          loadprofile={loadprofile}
          setLoadprofile={setLoadprofile}
        />
      ) : loadsetting ? (
        <Setting
          isDarkMode={isDarkMode}
          loadsetting={loadsetting}
          setLoadsetting={setLoadsetting}
        />
      ) : loadstatus ? (
        <Status
          isDarkMode={isDarkMode}
          loadstatus={loadstatus}
          setLoadstatus={setLoadstatus}
        />
      ) : (
        <>
          <UserComponent isDarkMode={isDarkMode} />
          <NavigationComponent
            loadprofile={loadprofile}
            setLoadprofile={setLoadprofile}
            loadsetting={loadsetting}
            setLoadsetting={setLoadsetting}
            loadstatus={loadstatus}
            setLoadstatus={setLoadstatus}
          />
        </>
      )}

      {/* <Status isDarkMode={isDarkMode} /> */}

      {/* <Profile isDarkMode={isDarkMode} /> */}
      {/* <Setting isDarkMode={isDarkMode} /> */}

      <div className="flex-1">
        <MessageComponent
          isDarkMode={isDarkMode}
          loadinfo={loadinfo}
          setLoadinfo={setLoadinfo}
        />
      </div>
      {/* Load Info Logic for Loading or Not Loading */}
      {loadinfo ? (
        <Info
          isDarkMode={isDarkMode}
          loadinfo={loadinfo}
          setLoadinfo={setLoadinfo}
        />
      ) : null}
    </div>
  );
};

export default Home;
