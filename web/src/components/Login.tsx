import React, { useState } from "react";

const Login = () => {
  const handleChange = () => {};
  return (
    <form>
      <label>Email</label>
      <input name="email" onChange={handleChange} />
      <label>Password</label>
      <input name="password" onChange={handleChange} />
    </form>
  );
};

export default Login;
