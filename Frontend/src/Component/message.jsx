import React, { useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import Filehandler from "../../utility/filehandler";
import Info from "./info";
import { useDispatch, useSelector } from "react-redux";
import { modechange } from "../redux/informationslice";
import { Link } from "react-router-dom";

const MessageComponent = ({ loadinfo, setLoadinfo }) => {
  const isDarkMode = useSelector((state) => {
    return state.information.isDarkMode;
  });
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const accentColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const sentMsgColor = isDarkMode ? "bg-blue-600" : "bg-blue-500";
  const receivedMsgColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const mode = isDarkMode ? "dark" : "light";
  const [chosenEmoji, setChosenEmoji] = useState(false);
  const [chosenEmojiCharacter, setChosenEmojiCharacter] = useState("");

  const [file, setFile] = useState(null);
  const [text, setText] = useState(""); // message text
  const [objfile, setObjfile] = useState(null); // uploading file

  const [isgrp, setIsgrp] = useState(false);

  const user = useSelector((state) => {
    return state.information.user;
  });

  const chatuser = useSelector((state) => {
    return state.information.chat;
  });

  // objmsg={msg: "message", file: "file",date:" ",id:email_addr} // uploading  message

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${month}/${day}/${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  const [messages, setMessages] = useState([
    {
      sender: {
        _id: " objectid1",
        email: "pirates10001@gmail.com",
        name: "Pirates",
      },
      msg: "Hello, how are you?",
      file: [""],
      date: "2023-05-16 12:34 PM",
      receiver: {
        _id: " objectid2",
        email: "naitikraj10001@gmail.com",
        name: "Naitik Raj",
      },
    },
  ]);

  // console.log("Chat User -1 ", chatuser,user);

  function onEmojiClick(event) {
    setChosenEmojiCharacter(event.emoji);
    setText((prevMsg) => prevMsg + event.emoji);
  }

  function prepareMessage(event) {
    setText(event.target.value);
  }

  async function getMsg() {
    const formData = new FormData();
    formData.append(
      "user",
      JSON.stringify({ _id: user._id, email: user.email, name: user.name })
    );
    formData.append(
      "chatuser",
      JSON.stringify({
        _id: chatuser._id,
        email: chatuser.email,
        name: chatuser.name,
      })
    );

    const isgrp = chatuser.admin != undefined;

    

    formData.append("isgrp", isgrp);

    console.log("Fetching Messages", user, chatuser);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/get_msg`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      // console.log("Messages Fetched", data, typeof data);

      setMessages([]);
      for (let i = 0; i < data.length; i++) {
        const newMessage = {
          sender: {
            _id: data[i].sender._id,
            email: data[i].sender.email,
            name: data[i].sender.name,
          },
          msg: data[i].msg,
          file: [
            {
              name: data[i]?.file?.name,
              type: data[i]?.file?.type,
              size: data[i]?.file?.size,
            },
            data[i]?.file?.url,
          ],
          date: data[i].date,
        };

        // console.log("New Msg", newMessage.sender);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    } catch (error) {
      console.log("Error in Fetching Messages", error);
    }
  }

  useEffect(() => {
    getMsg();
  }, [
    chatuser,
    useSelector((state) => {
      return state.information.rerender;
    }),
  ]);

  // setInterval(() => {
  //   getMsg();
  // }, 1000);

  async function sendMsg() {
    console.log("Sending Msg", chatuser);

    const tempobjfile = [];

    if (objfile && objfile[1]) {
      tempobjfile[0] = {
        name: objfile?.[0].name,
        type: "image/jpeg",
        size: objfile?.[0].size,
      };

      tempobjfile[1] =
        "https://res.cloudinary.com/dvxsgl5mr/image/upload/v1716233061/Test/vddnmdkg3hpqptah0xgk.gif";
    }
    const formattedDate = formatDate(new Date());
    const newMessage = {
      sender: { _id: user._id, email: user.email, name: user.name },
      msg: text,
      file: tempobjfile,
      date: formattedDate,
      receiver: {
        _id: chatuser._id,
        email: chatuser.email,
        name: chatuser.name,
      },
    };

    // console.log("Sending Msg", newMessage);

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setText("");
    setObjfile(null);

    // updating this info for real update
    let tempobjfile2 = [
      {
        name: objfile?.[0]?.name,
        type: objfile?.[0]?.type,
        size: objfile?.[0]?.size,
      },
      "",
    ];

    if (!objfile) {
      // only text msg
      tempobjfile2 = [];
    }

    const newMessage2 = {
      sender: { _id: user._id, email: user.email, name: user.name },
      msg: text,
      file: tempobjfile2,
      date: formattedDate,
      receiver: {
        _id: chatuser._id,
        email: chatuser.email,
        name: chatuser.name,
      },
    };

    const formData = new FormData();
    formData.append("sender", JSON.stringify(newMessage2.sender));
    formData.append("receiver", JSON.stringify(newMessage2.receiver));
    formData.append("msg", newMessage2.msg);
    formData.append("date", newMessage2.date);
    if (objfile && objfile[1]) {
      formData.append("file", file instanceof FileList ? file[0] : file); // Append the file object itself
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/send_msg`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const msg = await response.json();

      // as it is stored in  message array it is stored in last index

      //  update the last msg with real file link and information
      if (objfile) {
        tempobjfile2[1] = msg?.url ?? "";

        // if (tempobjfile2[1] == undefined) tempobjfile2[1] = null;
      }
      //  const len = messages.length - 1;
      //  console.log("Prev Msg ",messages[len])

      // Update the message with the actual file URL from the server response
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex].file = tempobjfile2;

        return updatedMessages;
      });

      console.log("Serve Msg ", msg?.url);
    } catch (error) {
      console.log("Error in Sending Message", error);
    }
  }

  const renderFilePreview = (file) => {
    if (file == null) return;
    // console.log("File Preview", file);
    if (file[0] && file[0].type) {
      if (file[0].type.startsWith("image/")) {
        return (
          <div className="mt-2 flex items-center">
            <img
              src={file[1]}
              alt={file[0].name}
              className="max-w-xs rounded-md"
            />
            <Link
              to={file[1]}
              download={file[0].name}
              className="ml-2 text-blue-500 hover:text-blue-700"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </Link>
          </div>
        );
      } else if (file[0].type === "application/pdf") {
        return (
          <div className="mt-2 bg-gray-200 rounded-md p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{file[0].name}</p>
                <p className="text-xs">{file[0].size}</p>
              </div>
              <Link
                to={file[1]}
                download={file[0].name}
                className="text-blue-500 hover:text-blue-700"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </Link>
            </div>
            <embed
              src={file[1]}
              type="application/pdf"
              className="w-full h-64"
            />
          </div>
        );
      } else if (file[0].type.startsWith("video/")) {
        return (
          <div className="mt-2 flex items-center">
            <video controls className="max-w-xs rounded-md">
              <source src={file[1]} type={file[0].type} />
              Your browser does not support the video tag.
            </video>
            <Link
              to={file[1]}
              download={file[0].name}
              className="ml-2 text-blue-500 hover:text-blue-700"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </Link>
          </div>
        );
      } else {
        return (
          <div className="mt-2 bg-gray-200 rounded-md p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{file[0].name}</p>
                <p className="text-xs">{file[0].size}</p>
              </div>
              <Link
                to={file[1]}
                download={file[0].name}
                className="text-blue-500 hover:text-blue-700"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </Link>
            </div>
            <embed src={file[1]} type={file[0].type} className="w-full h-64" />
          </div>
        );
      }
    }
    return null;
  };

  useEffect(() => {
    if (file) {
      console.log("File Selected", file);
      const reader = new FileReader();
      reader.onload = (event) => {
        // console.log('File Read', event.target.result);

        let newFile = null;
        if (file instanceof FileList) {
          // If file is a FileList, use the first file
          newFile = {
            name: file[0].name,
            type: file[0].type,
            size: formatFileSize(file[0].size),
          };
        } else if (file instanceof File) {
          // If file is a single File object
          newFile = {
            name: file.name,
            type: file.type,
            size: formatFileSize(file.size),
          };
        } else {
          console.error("Invalid file object");
          return;
        }

        // console.log("messages", messages);
        setObjfile([newFile, reader.result]);
      };

      if (file instanceof FileList) {
        reader.readAsDataURL(file[0]);
      } else if (file instanceof File) {
        reader.readAsDataURL(file);
      } else {
        console.error("Invalid file object");
      }
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1048576) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / 1048576).toFixed(2)} MB`;
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${bgColor} ${borderColor} overflow-hidden`}
      style={{ width: "100%" }}
    >
      {/* Video Call Section */}
      <div
        className={`flex items-center justify-between border-b ${borderColor} py-2 px-4`}
      >
        <div className="p-2">
          {/* Video Call Icon */}
          <img
            src="https://cdn.iconscout.com/icon/free/png-512/free-video-765-433880.png?f=webp&w=256"
            alt="Video Call"
            className="h-6 w-6"
          />
        </div>
        <div className="p-2">
          {/* User Info */}
          <div className="flex items-center">
            <img
              src={chatuser.profilePicture}
              alt="User"
              className="w-8 h-8 rounded-full mr-2"
              onClick={() => {
                setLoadinfo((prev_value) => !prev_value);
              }}
            />
            <div>
              <p className={`font-bold ${textColor}`}>{chatuser.name}</p>
              {/* <p className={`text-sm ${textColor}`}>User Status</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Message Display Section */}

      {/* Message Section */}
      <div
        className={`flex-grow p-4 ${bgColor} overflow-y-auto flex flex-col-reverse`}
      >
        {/* Message Content */}
        <div className="flex flex-col space-y-2">
          {messages.map((message, index) => (
            // console.log("Message", message.sender.email, user.email, ( message.sender.email == user.email)),
            <div
              key={index}
              className={
                message.sender.email == user.email
                  ? "flex items-end justify-end"
                  : "flex items-start"
              }
            >
              <div
                className={`${textColor} rounded-md p-2 ${
                  message.sender.email == user.email
                    ? sentMsgColor
                    : receivedMsgColor
                } max-w-prose ${
                  message.sender.email == user.email
                    ? "ml-auto flex flex-col items-end"
                    : "mr-auto flex flex-col"
                }`}
              >
                <div className="flex items-center">
                  <p>{message.msg}</p>
                  <span className="ml-2 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                {renderFilePreview(message.file)}
                <p
                  className={`text-xs ${textColor} mt-1`}
                >{`${message.sender.name} ${message.date}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emoji Picker and Charater Selection Logic */}

      {chosenEmoji ? (
        <div>
          <EmojiPicker theme={mode} onEmojiClick={onEmojiClick} />
          {`choose emojis: ${
            chosenEmojiCharacter ? chosenEmojiCharacter : `No Emoji Chosen Yet`
          }`}
        </div>
      ) : null}

      {/* Input Section */}
      <div
        className={`p-4 ${bgColor} flex items-center border-t ${borderColor}`}
      >
        {/* Input Text */}
        <input
          type="text"
          placeholder="Type a message..."
          className={`px-2 py-1 w-full focus:outline-none ${borderColor} ${textColor} rounded-md transition-colors duration-300 bg-transparent`}
          id="message_text"
          onChange={prepareMessage}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMsg();
            }
          }}
          value={text}
        />

        {/* Emoji Selector */}
        <button
          className={`${textColor} p-2 rounded-full transition-colors duration-300 hover:${accentColor}`}
          id="message_emoji"
          onClick={() => {
            setChosenEmoji(!chosenEmoji);
          }}
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
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        {/* file upload*/}

        <button
          className={`${textColor} p-2 rounded-full transition-colors duration-300 hover:${accentColor}`}
          id="message_file_upload"
          onClick={() => {
            Filehandler((selectedFiles) => {
              setFile(selectedFiles);
            });
          }}
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
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Voice Recording */}
        <button
          className={`${textColor} p-2 rounded-full transition-colors duration-300 hover:${accentColor}`}
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
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;