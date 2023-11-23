import React, { PropsWithChildren } from "react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps extends PropsWithChildren {
  variant?: WrapperVariant
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <div className="wrapper">
      {children}
    </div>
  );
};
