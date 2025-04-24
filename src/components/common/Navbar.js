import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import { Link } from 'react-router-dom';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import UserContext from '../../context/UserContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { useTheme } from '@mui/material/styles';
import '../../style/Navbar.scss';
import constraints from '../../constraints';
import HomeIcon from '@mui/icons-material/Home';
import SummarizeIcon from '@mui/icons-material/Summarize';
import axios from 'axios';

function Navbar() {
  const { accounts } = useMsal();
  const { user, showWatchlist } = useContext(UserContext);
  const userName = user || (accounts[0] && accounts[0].name);
  const userEmail = accounts[0]?.username;
  const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL ;
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userEmail) return;

      try {
        const response = await axios.get(`${url}/userroles?email=${encodeURIComponent(userEmail)}`);
        const fetchedRoleId = response.data[0]?.RoleID;
        console.log(fetchedRoleId);
        console.log(response.data);
        setRoleId(fetchedRoleId);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRoleId(null);
      }
    };

    fetchUserRole();
  }, [userEmail]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="navbar">
      <Box className="navbar-container">
        <Box className="navbar-left-header">
          <Link to="/" className="navbar-link">
            <Typography variant="h5" className="navbar-title">
              {constraints.NAVBAR.TITLE}
            </Typography>
          </Link>
        </Box>

        <AuthenticatedTemplate>
         
            <Box className="navbar-middle-header">
              <Link to="/" className="navbar-link">
                <IconButton color="inherit" sx={{ marginLeft: '0px', display: 'flex', alignItems: 'flex-end' }}>
                  <HomeIcon />
                  <Typography variant="body2">Home</Typography>
                </IconButton>
              </Link>

              {[1, 3, 4, 5].includes(roleId) && (
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                  sx={{ marginLeft: '0px', display: 'flex', alignItems: 'flex-end' }}
                >
                  <AdminPanelSettingsIcon />
                  <Typography variant="body2">Admin</Typography>
                </IconButton>
              )}

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                {[1, 3, 4, 5].includes(roleId) && (
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/employeestatus" style={{ textDecoration: 'none', color: 'black' }}>
                      Employee Reporting Status
                    </Link>
                  </MenuItem>
                )}

                {roleId === 1 && (
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/Updatepage" style={{ textDecoration: 'none', color: 'black' }}>
                      Department Owner Master
                    </Link>
                  </MenuItem>
                )}
              </Menu>

              <IconButton
                color="inherit"
                sx={{ marginLeft: '0px', display: 'flex', alignItems: 'flex-end' }}
              >
                <SummarizeIcon />
                <Typography variant="body2">Report</Typography>
              </IconButton>
            </Box>
          

          <Box className="navbar-actions">
            {showWatchlist && (
              <Link to="/watchlist" className="navbar-link">
                <Tooltip title="Watch List" className="navbar-tooltip">
                  <PersonSearchOutlinedIcon className="navbar-icon" />
                </Tooltip>
              </Link>
            )}
            {userName && (
              <Typography variant="h6" className="navbar-username">
                {userName}
              </Typography>
            )}
          </Box>
        </AuthenticatedTemplate>
      </Box>
    </Box>
  );
}

export default Navbar;
