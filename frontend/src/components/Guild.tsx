import React, { useEffect, useState } from "react";
import axios from "axios";

const Guild = ({}) => {
  const [guildName, setGuildName] = useState("");
  const [realmNames, setRealmNames] = useState([]);
  const [realmName, setRealmName] = useState("");
  const [guildMembers, setGuildMembers] = useState([]);

  const guildInfoApiCall = async () => {
    const res = await axios.get(
      `/wow/guild/:${realmName}/:${guildName}?fields=members`
    );
    console.log(res);
  };

  const getGuildInfo = () => {
    if (guildName === "") {
      console.log("no guild name entered");
    } else {
    }
  };

  const getRealms = async () => {
    const res = await axios.get("");
  };
  const handleSubmit = () => {
    // e.preventDefault();
    // getGuildInfo();
  };

  useEffect(() => {}, []);
  return (
    <>
      <div>Current Set Realm Name:{realmName}</div>
      <div>Current Set Guild Name: {guildName}</div>
      <div> Guild Members: {guildMembers}</div>
      <form onSubmit={handleSubmit}>
        <label>Guild Name:</label>
        <input
          type="text"
          value={guildName}
          onChange={(e) => {
            setGuildName(e.target.value);
          }}
          placeholder="Guild Name"
        />
        <label>Realm Name:</label>
        {/* <Select
          options={realmNames}
          onChange={(e) => {
            setRealmName(e.target.value);
          }}
          placeholder="Realm Name"
        /> */}
        <input type="submit" />
      </form>
    </>
  );
};

export default Guild;
