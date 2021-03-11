// eslint-disable-next-line
import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";

export default function Logout() {
  const { logout } = useAuth()!;

  let history = useHistory();
  return (
    <>
      <p>Are you sure you would like to log out?</p>
      <button>No</button>
      <button
        onClick={() => {
          history.push("/");
          logout();
        }}
      >
        Yes
      </button>
    </>
  );
}
