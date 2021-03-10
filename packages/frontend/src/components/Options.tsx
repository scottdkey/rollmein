// eslint-disable-next-line
import React, { useState } from "react";

const Options = () => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const HoverContent = () => {
    return <div className="options-content">Options</div>;
  };
  const OptionsArea = () => (
    <div className="options-area">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        className={
          hovered || clicked ? "options-button-open" : "options-button-closed"
        }
      >
        Options
      </div>
      {hovered || clicked ? <HoverContent /> : null}
    </div>
  );

  return (
    <>
      <OptionsArea />
    </>
  );
};
export default Options;
