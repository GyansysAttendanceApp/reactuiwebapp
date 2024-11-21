import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import { useMsal } from "@azure/msal-react";
import axios from "axios";
import ApplictionRoutes from "./routes/ApplictionRoutes";
import ProtectRoute from "./routes/ProtectRoute";

function App() {
  const { accounts } = useMsal();
  const [username, setUsername] = useState(
    localStorage.getItem("username") || null
  );
  const [userRoles, setUserRoles] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  // const url = "http://localhost:5000/api";
  // const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
  const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
  console.log("APPURL", url);

  console.log("app", username);
  console.log("App", accounts);

  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      const username = accounts[0].name;
      setUsername(username);
      localStorage.setItem("username", username);

      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${url}/userroles`, {
            params: { email: accounts[0].username },
          });
          console.log("APPDATA", response);
          const roles = response.data;
          setUserRoles(roles);
          const hasAccess = roles.some(
            (role) => role.RoleID === 1 || role.RoleID === 3
          );
          setShowWatchlist(hasAccess);
        } catch (error) {
          console.error("Error fetching user roles:", error);
        }
      };

      fetchUserRole();
    } else {
      localStorage.removeItem("username");
      setShowWatchlist(false);
    }
  }, [accounts]);


  useEffect(() => {
    if (username) {
      navigate("/home");
    }
  }, [username]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar username={username} showWatchlist={showWatchlist} />
      <ProtectRoute  username={username}><ApplictionRoutes/></ProtectRoute>
    </Box>
  );
}

export default App; 
