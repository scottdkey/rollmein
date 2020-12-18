// eslint-disable-next-line
import React from "react";
import { RoleLogoImageInterface } from "../types/Interfaces";

const RoleLogoImage = ({
  active,
  source,
  type,
  onClick,
}: RoleLogoImageInterface) => (
  <>
    <img
      className={`image ${active ? "roles_active" : "roles_inactive"}`}
      src={source}
      alt={`${type} logo`}
      onClick={() => {
        onClick();
      }}
    />
  </>
);
export default RoleLogoImage;
