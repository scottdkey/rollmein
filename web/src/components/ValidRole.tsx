// eslint-disable-next-line
import React from "react";
import { Tooltip } from "antd";

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
    <Tooltip placement="top" title={toolTipText}>
      <div className="role">
        <img
          src={image}
          className={isRoleValid ? "valid-image" : "image"}
          alt={altImageText}
        />
        <div className="role-count">{isRoleValid ? null : roleCount}</div>
        {children}
      </div>
    </Tooltip>
  );
};

export default ValidRole;
