// eslint-disable-next-line
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "./providers/AuthProvider";
import { AuthObject } from "./utils/Interfaces";

type AuthType = {
  type?: string;
};

const Authenticate = ({ type }: AuthType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { login, register } = useAuth()!;
  const history = useHistory();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (type === "login") {
      const loggingInUser: AuthObject = { email, password };
      login(loggingInUser);
      history.push("/");
    } else if (type === "register") {
      const newUser: AuthObject = { email, password };
      register(newUser);
    } else {
      console.log("error");
    }
  };
  function veryifyPassword() {
    if (password === passwordConfirm) {
      return null;
    } else {
      return (
        <>
          <p>Passwords do not match</p>
        </>
      );
    }
  }

  const CheckPassword = () => (type === "login" ? null : veryifyPassword());

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input name="password" onChange={(e) => setPassword(e.target.value)} />

        {type === "register" ? (
          <>
            <label>Confirm Password</label>
            <input
              name="passwordConfirm"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </>
        ) : null}
        <CheckPassword />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Authenticate;
