// eslint-disable-next-line
import React from "react";

interface ValidRoleInterface {
  roleCount: number;
  image: string;
  miniumNumber: number;
  toolTipText: string;
  children?: React.ReactNode;
  altImageText: string;
}

const ValidRole = ({
  roleCount,
  image,
  miniumNumber,
  toolTipText,
  children,
  altImageText,
}: ValidRoleInterface) => {
  const isRoleValid = roleCount >= miniumNumber;

  return (
    <>
    </>
  );
};

export default ValidRole;
