import React from "react";
import MFALogin from "../components/MFALogin";
import UserContext from "../context/UserContext";

export const ProtectRoute=({ children })=> {
  const { user } = UserContext;
  console.log({user});
  

  if (!user) {
    return <MFALogin />;
  }
  return <>{children}</>;
};
React.memo(ProtectRoute)
