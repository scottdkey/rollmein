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
    <Tooltip
      placement="top"
      title={
        isRoleValid
          ? `There are ${roleCount} ${altImageText}${
              roleCount > 1 && altImageText !== "DPS" ? "s" : ""
            } in the roll`
          : toolTipText
      }
    >
      <div className="role">
        <img
          src={image}
          className={isRoleValid ? "valid-image" : "image"}
          alt={`${altImageText} logo`}
        />
        <div className="role-count">{roleCount}</div>
        {children}
      </div>
    </Tooltip>
  );
};

export default ValidRole;
