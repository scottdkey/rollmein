import React from "react";

type SVGImage = {
  src: string;
  className: string;
  onClick(): any;
  fill?: string;
};

const SVGImage = ({ src, className, onClick, fill }: SVGImage) => {
  return (
    <>
      <svg xmlns={src} fill={fill} className={className} onClick={onClick()} />
    </>
  );
};


export default SVGImage