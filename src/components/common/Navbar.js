import React, { useContext , useState  } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import UserContext from "../../context/UserContext";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";

function Navbar() {
  const { instance, accounts } = useMsal();

  const { user, showWatchlist } = useContext(UserContext);
  const userName =( user || (accounts[0] && accounts[0].name));

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
      <div style={{display:"flex" , alignItems:"center" ,gap:"10px"}}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            GyanSys India - Attendance Tracker
          </Link>
        </Typography>
        {/* <Box> */}
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
       
             sx={{  marginLeft:"0px"  }}
          >
            <AdminPanelSettingsIcon  />
            <Typography>Admin</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link to="/configuration-master" style={{ textDecoration: "none", color: "black" }}>
                Configuration Master
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/admin-master" style={{ textDecoration: "none", color: "black" }}>
                Admin Master
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/department-master" style={{ textDecoration: "none", color: "black" }}>
                Department Master
              </Link>
            </MenuItem>
          </Menu>
         </div>
        {/* </Box> */}
  
        {/* <Typography sx={{display:"flex" , alignItems:"center" ,}}>
          <AdminPanelSettingsIcon/>Admin
        </Typography> */}
        

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
