import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  useParams,
} from "react-router-dom";
import Login from "./Component/login.jsx";
import Home from "./Component/navigation.jsx";
import Registration from "./Component/registration.jsx";
import { authchange, userchange } from "./redux/informationslice";

function User() {
  const { userId } = useParams();
  return <h1>This Url {userId} is not correct</h1>;
}

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.information.isAuth);

  fetch(`${import.meta.env.VITE_BACKEND_URL}/auth`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (response) => {
      const msg = await response.json();
      // console.log("Response from the server", msg);

      if (msg.error) {
        console.log("Is Auth", isAuth);
        console.log("Error in Signin User", msg.error);
        return false;
      }
      // console.log("User is Authenticated", msg.user);
      dispatch(authchange(true));
      dispatch(userchange(msg.user));
      return true;
    })
    .catch((error) => {
      console.error("Error in Auth", error);
      return false;
    });

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: isAuth ? <Home /> : <Login />,
        },
        {
          path: "/register",
          element: isAuth ? <Home /> : <Registration />,
        },
        {
          path: "/:userId",
          element: <User />,
        },
      ])}
    />
  );
}

export default App;
