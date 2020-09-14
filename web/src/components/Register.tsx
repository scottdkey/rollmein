import React, {useState} from 'react'


const Register = () => {
const handleChange = () => {}
  return (
    <form>
      <label>Email</label>
      <input name="email" onChange={handleChange}/>
      <label>Password</label>
      <input name="password" onChange={handleChange}/>
      <label>Confirm Password</label>
      <input name="passwordConfirm" onChange={handleChange}/>
      <button type="submit">Submit</button>
    </form>
  )
}

export default Register