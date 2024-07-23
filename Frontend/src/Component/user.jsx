import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatchange, userchange } from "../redux/informationslice";

const UserComponent = () => {
  const isDarkMode = useSelector((state) => state.information.isDarkMode);
  const user = useSelector((state) => state.information.user);
  const [friends, setFriends] = useState([]);
  const [Searchfriend, setSearchfriend] = useState([]);

  const inputColor = isDarkMode ? "text-gray-300" : "text-gray-800";
  const buttonBgColor = isDarkMode ? "bg-blue-500" : "bg-blue-400";
  const buttonHoverColor = isDarkMode
    ? "hover:bg-blue-600"
    : "hover:bg-blue-500";
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const userBorderColor = isDarkMode ? "border-gray-600" : "border-gray-200";
  const userBgColor = isDarkMode ? "bg-gray-900" : "bg-gray-200";
  const userTextColor = isDarkMode ? "text-white" : "text-black";
  const accentColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const userPadding = "p-4";

  const dispatch = useDispatch();

  const fetchFriends = async () => {
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(user));

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get_friend`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data);
      setSearchfriend(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  function handleSearch(e) {
    let searchtext = e.target.value;
    console.log("Searching Name ", searchtext);

    if(searchtext === " "){
      return;
    }

    // convert search text to lowercase
    searchtext = searchtext.toLowerCase();

    searchtext=searchtext.trim();

    // filter friends based on search text such that if any friend name contains search text then it will be shown
    const filteredFriends = Searchfriend.filter((friend) =>
      friend.name.toLowerCase().includes(searchtext)
    );

    setFriends(filteredFriends);


  }
  useEffect(() => {
    if (user) {
      console.log("Fetching friends... Frontend/src/Component/user.jsx:134");
      fetchFriends();
    }
  }, [
    user,
    useSelector((state) => {
      return state.information.rerender;
    }),
  ]);

  return (
    <div
      className={`hidden md:block w-2/5 sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/3 border-l border-gray-400 pl-4 ml-20 ${bgColor} border-r-2 ${borderColor}`}
    >
      <div className={`h-full ${bgColor} overflow-hidden`}>
        {/* Search Box */}
        <div
          className={`flex items-center justify-between border-b ${borderColor} py-2`}
        >
          <input
            type="text"
            placeholder="Search by name..."
            onChange={handleSearch}
            className={`px-2 py-1 w-full focus:outline-none ${inputColor} ${textColor} ${bgColor} border ${borderColor} rounded-md transition-colors duration-300`}
          />
          {/* <button
            className={`${textColor} p-2 rounded-full transition-colors duration-300 hover:${accentColor}`}
          > */}
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {/* </button> */}
        </div>

        <div className={`h-full overflow-y-auto`}>
          {/* User List */}
          <div className={`${bgColor} p-4`}>
            {friends.map((friend, index) => (
              <div
                key={index}
                className={`flex items-center border ${userBorderColor} ${userBgColor} ${userTextColor} ${userPadding} mb-2 rounded-md transition-colors duration-300`}
                onClick={() => {
                  // dispatch(chatchange(friend.user));
                  dispatch(chatchange(friend));
                }}
              >
                <img
                  src={
                    friend.profilePicture ||
                    "https://api.multiavatar.com/Binx%20Bond.svg"
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-grow">
                  <p className="font-bold">{friend.name}</p>
                  <p>{friend.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
