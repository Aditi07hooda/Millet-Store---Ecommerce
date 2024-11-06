import Button from "@/components/UI/Button";
import { getUserData } from "@/store/LocalStorage";
import React from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/UI/Loader.jsx";

const User = dynamic(() => import("../../components/User.jsx"), {
  loading: () => <Loader />,
});
const Login = dynamic(() => import("../../components/Login.jsx"), {
  loading: () => <Loader />,
});

const profile = () => {
  const userPresent = getUserData() ? true : false;
  const logoutHandler = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {userPresent ? <User /> : <Login />}
      <div className="flex justify-end">
        <Button onClick={logoutHandler} text="Logout" />
      </div>
    </>
  );
};

export default profile;
