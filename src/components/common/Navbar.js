import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import UserContext from "../../context/UserContext";

function Navbar() {
  const { instance, accounts } = useMsal();

  const { user, showWatchlist } = useContext(UserContext);
  const userName =( user || (accounts[0] && accounts[0].name));

  const handleLoginRedirect = () => {
    instance.loginRedirect();
  };

  const handleLogoutRedirect = () => {
    instance.logout();
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#1670b9",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            GyanSys India - Attendance Tracker
          </Link>
        </Typography>

        <div style={{ display: "flex", alignItems: "center" }}>
          {showWatchlist && (
            <Link
              to="/watchlist"
              style={{
                textDecoration: "none",
                color: "white",
                marginRight: "20px",
              }}
            >
              <Tooltip title="Watch List">
                <PersonSearchOutlinedIcon />
              </Tooltip>
            </Link>
          )}
          {userName && (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "white",
                  marginRight: "20px",
                }}
              >
                {userName}
              </Typography>
            </>
          )}
          {/* {!username && (
            <button onClick={handleLoginRedirect}>Login</button>
          )} */}
        </div>
      </Box>
    </div>
  );
}

export default Navbar;
