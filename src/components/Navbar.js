import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from '@mui/material/Tooltip';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
// import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import UserContext from "../context/UserContext";

function Navbar() {
  const { instance} = useMsal();

  const {user,showWatchlist}=useContext(UserContext);
  // const user=accounts[0]&&accounts[0].name;

  // console.log({user});
  

  // const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`


  // const [username, setUsername] = useState(localStorage.getItem("username") || null);
  // const [showWatchlist, setShowWatchlist] = useState(false);
  // const [showWatchlistIcon, setShowWatchlistIcon] = useState(false);


  /// Below code is Icon show and hide///////////
 
   /// Reference code 
  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     const email = accounts[0]?.username;
  //     try {
  //       const response = await axios.get(`http://localhost:5000/api/userroles?email=${email}`);
  //       const roles = response.data;
  //       if (roles.some(role => role.RoleID === 1 || role.RoleID === 3)) {
  //         setShowWatchlistIcon(true);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user roles: ', error);
  //     }
  //   };

  //   if (accounts[0]?.username) {
  //     fetchUserRole();
  //   }
  // }, [accounts]);


  // useEffect(() =>{

  //   if(instance){
  //     instance.loginRedirect();
  //   }
    
  // }, [instance])

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
          color: "white"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            GyanSys India - Attendance Tracker
          </Link>
        </Typography>

        <div style={{ display: "flex", alignItems: "center" }}>
          {showWatchlist && (   
            <Link to="/watchlist" style={{ textDecoration: 'none', color: 'white', marginRight: "20px" }}>
              <Tooltip title="Watch List">
                <PersonSearchOutlinedIcon />
              </Tooltip>
            </Link>
          )}
          {user && (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer", color: "white", marginRight: "20px" }}>
                {user}
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

































