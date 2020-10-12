import React from "react";

import { SVGImage } from "./utils/Types";

const SVGImage = ({ src, className, onClick, fill }: SVGImage) => {
  return (
    <>
      <svg xmlns={src} fill={fill} className={className} onClick={onClick()} />
    </>
  );
};

export default SVGImage;
