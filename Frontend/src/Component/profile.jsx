import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modechange, rerenderchange } from "../redux/informationslice";

function Profile({ loadprofile, setLoadprofile }) {
  const isDarkMode = useSelector((state) => {
    return state.information.isDarkMode;
  });

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const [selectedImage, setSelectedImage] = useState(
    useSelector((state) => state.information.user.profilePicture)
  );

  const [updatedBio, setUpdatedBio] = useState("");

  const user = useSelector((state) => {
    return state.information.user;
  });



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
    const form = new FormData();
    form.append("user", JSON.stringify({ _id: user._id }));

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

    const form = new FormData(event.target);
    form.append("user", JSON.stringify({ _id: user._id }));

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

  useEffect(() => {
    GetProfile();
  }, [
    useSelector((state) => {
      return state.information.rerender;
    }),
  ]);
  return (
    <div
      className={`min-h-screen ${bgColor} border-l-2 border-r-2 ${borderColor}`}
    >
      <div className="flex flex-col h-full">
        {/* Back Button */}
        <div
          className="mt-4 ml-4"
          onClick={() => setLoadprofile((prev) => !prev)}
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

        {/* Profile Content */}
        <div className={`flex-1 overflow-y-auto p-6 lg:px-8`}>
          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <h2
              className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}
            >
              Profile
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
            <form className="space-y-6" onSubmit={SetProfile} method="POST">
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
                        src="https://api.multiavatar.com/Binx%20Bond.png"
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

              {/* Display Name */}
              <div
                className={`block text-sm font-medium leading-6 ${textColor}`}
              >
                <label htmlFor="name">Name</label>
                <p className="mt-2">{user.name}</p>
              </div>

              {/* Display Email */}
              <div
                className={`block text-sm font-medium leading-6 ${textColor}`}
              >
                <label htmlFor="email">Email address</label>
                <p className="mt-2">{user.email}</p>
              </div>

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
                  placeholder="Enter your bio..."
                  value={updatedBio}
                  onChange={handleBioChange}
                ></textarea>
                <button
                  type="submit"
                  className={`mt-4 w-full rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 bg-gray-700 hover:bg-gray-600`}
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
