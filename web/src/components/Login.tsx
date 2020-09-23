// eslint-disable-next-line
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "./providers/AuthProvider";
import { AuthObject } from "./utils/Interfaces";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth()!;
  const history = useHistory();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const loggingInUser: AuthObject = { email, password };
    login(loggingInUser);
    history.push("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input name="email" onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input name="password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
