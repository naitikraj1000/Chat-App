import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  modechange,
  chatchange,
  userchange,
  rerenderchange,
} from "../redux/informationslice";
import { GetMembers } from "../../../Backend/controller/group";

function Info({ loadinfo, setLoadinfo }) {
  const isDarkMode = useSelector((state) => state.information.isDarkMode);
  const user = useSelector((state) => state.information.user);
  const chatuser = useSelector((state) => state.information.chat);
  const visible_admin = user._id === chatuser.admin;
  const visible_grp_member = chatuser.admin != undefined;

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const buttonBgColor = isDarkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-200 hover:bg-gray-300";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  const [selectedImage, setSelectedImage] = useState(null);
  const [bio, setBio] = useState("");
  const [updatedBio, setUpdatedBio] = useState("");
  const [showAddFriendBox, setShowAddFriendBox] = useState(false);
  const [allMembers, setAllMembers] = useState([]);

  const handleMemberClick = () => {
    setShowAddFriendBox((val) => !val);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (event) => {
    setUpdatedBio(event.target.value);
  };

  async function GetProfile() {
    setUpdatedBio("");
    const form = new FormData();
    form.append("user", JSON.stringify({ _id: chatuser._id }));
    console.log("GetProfile", chatuser._id, chatuser.name);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get_profile`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      setUpdatedBio(data.bio.bio);
    } catch (error) {
      console.error("Failed to GetProfile", error);
    }
  }

  async function SetProfile(event) {
    event.preventDefault();

    console.log("SetProfile", user._id, chatuser._id);

    console.log("SetProfile ==> ", event.target);
    const form = new FormData(event.target);
    form.append("user", JSON.stringify({ _id: chatuser._id }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/set_profile`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = res.json();

      console.log(res.message);
    } catch (error) {
      console.log("Failed to SetProfile", error);
    }
  }

  const handleMember = async (event) => {
    event.preventDefault();
    handleMemberClick();
    // Create FormData synchronously from the form
    const formData = new FormData(event.target);
    formData.append("group_id", chatuser._id);

    // Log individual field values to verify
    console.log(formData.get("email"));

    try {
      // Perform asynchronous operation (e.g., fetch)
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/add_member`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Error in Adding Member");
      }

      const data = await res.json();
      console.log(data); // Handle response data if needed
    } catch (error) {
      console.error("Error in Adding Member", error);
    }
  };

  async function GetMembers() {

    const form = new FormData();
    form.append("group_id", chatuser._id);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get_members`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to get members");
      }

      const data = await res.json();
      setAllMembers(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to GetMembers", error);
    }
  }

  useEffect(() => {
    GetProfile();
    GetMembers();
  }, [
    useSelector((state) => {
      return state.information.rerender;
    }),
    chatuser._id,
  ]);

  return (
    <div className="min-h-screen w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 border-l-2 border-r-2 border-gray-300">
      <div className={`h-full ${bgColor} overflow-hidden`}>
        <div className="mt-4 ml-4">
          {/* Back Button */}
          <button
            className={`p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none`}
            onClick={() => {
              setLoadinfo((prev_value) => !prev_value);
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
        <div className={`h-full overflow-y-auto`}>
          <div className={`${textColor} px-6 py-12 lg:px-8`}>
            {/* Profile Info */}
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
              <h2
                className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
              >
                Info Profile
              </h2>
            </div>

            <form className="space-y-6" onSubmit={SetProfile} method="POST">
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
                {/* Image Loading Code */}
                <div className="flex justify-center">
                  <label htmlFor="photo" className="relative inline-block">
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <img
                          src={chatuser.profilePicture}
                          alt="Default"
                          className="object-cover w-full h-full rounded-full"
                        />
                      )}
                    </div>

                    {visible_admin && (
                      <input
                        id="photo"
                        name="file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    )}
                  </label>
                </div>
              </div>

              <div className="mt-6 text-center">
                <h2
                  className={`text-2xl font-bold leading-9 tracking-tight ${textColor}`}
                >
                  {chatuser.name}
                </h2>
                {/* Bio Field */}
                <div
                  className={`block text-sm font-medium leading-6 ${textColor}`}
                >
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${bgColor} ${textColor}`}
                    value={updatedBio}
                    onChange={handleBioChange}
                  ></textarea>
                  <button
                    type="submit"
                    className={`mt-4 w-full rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible_admin:outline focus-visible_admin:outline-2 focus-visible_admin:outline-offset-2 focus-visible_admin:outline-indigo-600 bg-gray-700 hover:bg-gray-600`}
                    style={{ display: visible_admin ? "block" : "none" }}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </form>

            {/* {Add Friend Box Logic}  */}
            <div
              className="mt-8"
              style={{ display: visible_admin ? "block" : "none" }}
            >
              <div className="text-center">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-semibold leading-6 shadow-sm focus:outline-none focus-visible_admin:outline-none ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={handleMemberClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 4a1 1 0 00-1-1h-2a1 1 0 00-1 1v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V4zM6 18a2 2 0 114 0 2 2 0 01-4 0zm10 0a2 2 0 114 0 2 2 0 01-4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Friends
                </button>
              </div>
              {/* Add Friend Box */}
              {showAddFriendBox && (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
                  onClick={handleMemberClick}
                >
                  <div
                    className={`bg-white ${
                      isDarkMode ? "dark:bg-gray-800" : ""
                    } p-4 rounded-md shadow-md relative`}
                    onClick={(e) => e.stopPropagation()} // Prevent the click from propagating to the parent div
                  >
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={handleMemberClick}
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
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <h2 className="text-lg font-bold mb-4">Add Friends</h2>
                    {/* Add Friend Form */}
                    <form onSubmit={handleMember} method="POST">
                      <input
                        type="email"
                        name="email" // Ensure the name attribute is set
                        placeholder="Enter email"
                        className={`block w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-indigo-500 ${
                          isDarkMode
                            ? "text-white bg-gray-800"
                            : "text-gray-900 bg-white"
                        }`}
                      />
                      <button
                        type="submit"
                        className={`block w-full px-4 py-2 ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-indigo-500 hover:bg-indigo-600"
                        } text-white rounded-md focus:outline-none`}
                      >
                        Add Friend
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {visible_grp_member && (
  <>
    {/* User Information */}
    <h3 className="text-xl font-semibold my-4 text-center">
      User Information
    </h3>
    {/* User Details Box */}
    <div
      className={`max-h-72 overflow-y-auto rounded-lg p-4 ${buttonBgColor} ${textColor}`}
    >
      <div className="space-y-4">
        {allMembers.map((member, index) => (
          <div
            key={member._id}
            className="flex items-center space-x-4 border-b border-gray-400 py-4"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
              <img
                src={member.profilePicture}
                alt={`User ${index + 1}`}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div>
              <p className="font-semibold">{member.name}</p>
              <p>Email: {member.email}</p>
              {chatuser.email === member.email && (
                <p className="text-sm text-red-500 font-semibold">Admin</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
)}


            {!visible_admin && (
              <div className="mt-8">
                {/* Buttons */}
                <div className="flex flex-wrap justify-center space-x-4  py-4">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-semibold leading-6 shadow-sm focus:outline-none focus-visible_admin:outline-none ${buttonBgColor}`}
                  >
                    Block
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-semibold leading-6 shadow-sm focus:outline-none focus-visible_admin:outline-none ${buttonBgColor}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
