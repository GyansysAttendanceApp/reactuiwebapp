import React from "react";

import { useNavigate } from "react-router-dom";
import MFALogin from "../components/MFALogin";
import { useMsal } from "@azure/msal-react";

export default function ProtectRoute ({children , username ,}) {

  const navigate = useNavigate();

  const { instance } = useMsal();

  if (!username) {
    return <MFALogin/>
  }

  return <>{children}</>;
};

