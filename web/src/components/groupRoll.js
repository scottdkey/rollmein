import React, { useState, useEffect } from "react";

const GroupRoll = ({ valid, inGroup }) => {
  const [currentlyValid, setCurrentlyValid] = useState(valid);

  useEffect(() => {
    setCurrentlyValid(valid);
  }, [valid]);

  return (
    <>
      <button disabled={!currentlyValid}>Roll!</button>
    </>
  );
};

export default GroupRoll;
