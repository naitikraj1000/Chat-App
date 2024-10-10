// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { modechange } from "../redux/informationslice";

// function Forgetpassword() {
//   const [visibleotp, setVisibleotp] = useState(false);
//   const navigate = useNavigate();
//   const [isDarkMode, setIsDarkMode] = useState(
//     useSelector((state) => {
//       return state.information.isDarkMode;
//     })
//   );
//   const dispatch = useDispatch();
//   const toggleDarkMode = () => {
//     dispatch(modechange(!isDarkMode));
//     setIsDarkMode(!isDarkMode);
//   };
//   const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
//   function forget_password(email) {
//     // Create a FormData object
//     const formData = new FormData();
//     formData.append("email", email); // Append the email to the FormData object
//     console.log(formData);
//     axios
//       .post(`${import.meta.env.VITE_BACKEND_URL}/forget_password`, formData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data", // Keep the content type as multipart/form-data
//         },
//       })
//       .then((response) => {
//         setVisibleotp(true);
//         console.log("OTP has been sent to Email", response.data);
//       })
//       .catch((error) => {
//         console.log("Error in Forgetting Password", error);
//       });
//   }

//   function verify_otp(email, otp, password, confirmpassword) {
//     if (password !== confirmpassword) {
//       console.log("Password and Confirm Password do not match");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("otp", otp);
//     formData.append("password", password);

//     axios
//       .post(`${import.meta.env.VITE_BACKEND_URL}/verify_otp`, formData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         console.log("Password is Being Reset", response.data);
//         navigate("/");
//       })
//       .catch((error) => {
//         console.error("Error in Verifying OTP", error);
//       });
//   }

//   return (
//     <>
//       <div className={`min-h-screen ${bgColor}`}>
//         <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//           <button
//             className="p-2 rounded-full transition-colors duration-300 focus:outline-none"
//             onClick={toggleDarkMode}
//           >
//             {isDarkMode ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6 text-yellow-300"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6 text-gray-800"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//                 />
//               </svg>
//             )}
//           </button>

//           <label htmlFor="email">Email</label>
//           <br />
//           <input type="email" id="email" placeholder="Enter Your Email" />
//           <br />

//           <label
//             htmlFor="otp"
//             style={{ display: visibleotp ? "block" : "none" }}
//           >
//             OTP
//           </label>
//           <input
//             type="text"
//             id="otp"
//             placeholder="Enter OTP"
//             style={{ display: visibleotp ? "block" : "none" }}
//           />
//           <button
//             onClick={() => {
//               forget_password(document.getElementById("email").value);
//             }}
//             style={{ display: visibleotp ? "none" : "block" }}
//           >
//             Forget Password
//           </button>

//           <label
//             htmlFor="newpassword"
//             style={{ display: visibleotp ? "block" : "none" }}
//           >
//             New Password
//           </label>
//           <input
//             type="password"
//             id="newpassword"
//             placeholder="Enter New Password"
//             style={{ display: visibleotp ? "block" : "none" }}
//           />
//           <label
//             htmlFor="confirmpassword"
//             style={{ display: visibleotp ? "block" : "none" }}
//           >
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             id="confirmpassword"
//             placeholder="Confirm Password"
//             style={{ display: visibleotp ? "block" : "none" }}
//           />
//           <button
//             onClick={() => {
//               verify_otp(
//                 document.getElementById("email").value,
//                 document.getElementById("otp").value,
//                 document.getElementById("newpassword").value,
//                 document.getElementById("confirmpassword").value
//               );
//             }}
//             style={{ display: visibleotp ? "block" : "none" }}
//           >
//             Reset Password
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Forgetpassword;


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { modechange } from "../redux/informationslice";

function Forgetpassword() {
  const [visibleotp, setVisibleotp] = useState(false);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.information.isDarkMode);
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    dispatch(modechange(!isDarkMode));
  };

  const bgColor = isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const inputBgColor = isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black";
  const buttonColor = isDarkMode
    ? "bg-yellow-500 hover:bg-yellow-600 text-black"
    : "bg-blue-500 hover:bg-blue-600 text-white";

  function forget_password(email) {
    const formData = new FormData();
    formData.append("email", email);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/forget_password`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setVisibleotp(true);
        console.log("OTP has been sent to Email", response.data);
      })
      .catch((error) => {
        console.log("Error in Forgetting Password", error);
      });
  }

  function verify_otp(email, otp, password, confirmpassword) {
    if (password !== confirmpassword) {
      console.log("Password and Confirm Password do not match");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("password", password);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/verify_otp`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Password is Being Reset", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error in Verifying OTP", error);
      });
  }

  return (
    <>
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

          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Your Email"
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none ${inputBgColor}`}
          />

          {visibleotp && (
            <>
              <label htmlFor="otp" className="block mt-4 text-sm font-medium">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                className={`mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none ${inputBgColor}`}
              />

              <label
                htmlFor="newpassword"
                className="block mt-4 text-sm font-medium"
              >
                New Password
              </label>
              <input
                type="password"
                id="newpassword"
                placeholder="Enter New Password"
                className={`mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none ${inputBgColor}`}
              />

              <label
                htmlFor="confirmpassword"
                className="block mt-4 text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmpassword"
                placeholder="Confirm Password"
                className={`mt-1 p-2 block w-full rounded-md border border-gray-300 focus:outline-none ${inputBgColor}`}
              />

              <button
                onClick={() => {
                  verify_otp(
                    document.getElementById("email").value,
                    document.getElementById("otp").value,
                    document.getElementById("newpassword").value,
                    document.getElementById("confirmpassword").value
                  );
                }}
                className={`mt-6 p-2 w-full rounded-md ${buttonColor} focus:outline-none`}
              >
                Reset Password
              </button>
            </>
          )}

          {!visibleotp && (
            <button
              onClick={() => {
                forget_password(document.getElementById("email").value);
              }}
              className={`mt-6 p-2 w-full rounded-md ${buttonColor} focus:outline-none`}
            >
              Forget Password
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Forgetpassword;
