// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { useAuth } from "./providers/AuthProvider";
import { AuthObject } from "./utils/Interfaces";

const Authenticate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [loginForm, setLoginForm] = useState(true);
  const { login, register, error, authenticated } = useAuth()!;
  const history = useHistory();

  function showError() {
    if (!loginForm && passwordsMatch) {
      return true;
    } else return false;
  }

  const Errors = () => (
    <div className="form-errors">
      <div>{error}</div>
      <div>{showError() ? "Passwords don't match" : null}</div>
    </div>
  );
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (loginForm) {
      const loggingInUser: AuthObject = { email, password };
      login(loggingInUser);
      history.push("/");
    } else {
      const newUser: AuthObject = { email, password };
      register(newUser);
    }
  };

  useEffect(() => {
    setPasswordsMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  if (authenticated) {
    return <Redirect to="players" />;
  } else {
    return (
      <form className="authenticate-form">
        <div className="form-select">
          <div
            className={loginForm ? "selected" : "not-selected"}
            id="login"
            onClick={() => setLoginForm(true)}
          >
            Login
          </div>
          <div
            className={!loginForm ? "selected" : "not-selected"}
            id="register"
            onClick={() => setLoginForm(false)}
          >
            Reigster
          </div>
        </div>
        <div className="form-item">
          <input
            className="form-input"
            name="email"
            value={email}
            type="email"
            placeholder="Email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="form-item">
          <input
            className="form-input"
            name="password"
            value={password}
            type="password"
            placeholder="Password"
            required={true}
            onChange={(e) => {
              e.preventDefault();
              setPassword(e.target.value);
            }}
          />
        </div>
        {!loginForm ? (
          <div className="form-item">
            <input
              className="form-input"
              name="passwordConfirm"
              type="password"
              autoComplete="off"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
            />
          </div>
        ) : null}
        <Errors />
        <div onClick={handleSubmit} className="form-button">
          Submit
        </div>
      </form>
    );
  }
};
export default Authenticate;
