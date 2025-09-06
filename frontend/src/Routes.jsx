import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import Login from "./component/auth/Login";
import Signup from "./component/auth/Signup";
import Dashboard from "./component/dashboard/Dashboard";
import Profile from "./component/user/Profile";

import { useAuth } from "./authContext";
import RepoForm from "./component/repo/RepoForm";

const AppRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  const routes = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/repo/create",
      element: <RepoForm />,
    },
  ]);

  return routes;
};

export default AppRoutes;
