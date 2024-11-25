import React, { useContext, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import { Link } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import UserContext from '../../context/UserContext'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import { useTheme } from '@mui/material/styles'
import '../../style/Navbar.scss'
import constraints from '../../constraints'

function Navbar() {
  const { accounts } = useMsal()
  const { user, showWatchlist } = useContext(UserContext)
  const userName = user || (accounts[0] && accounts[0].name)
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="navbar">
      <Box className="navbar-container">
        <Box className="navbar-left-header">
          <Link to="/" className="navbar-link">
            <Typography variant="h5" className="navbar-title">
              {constraints.NAVBAR.TITLE}
            </Typography>
          </Link>
          <IconButton color="inherit" onClick={handleMenuClick} sx={{ marginLeft: '0px' }}>
            <AdminPanelSettingsIcon />
            <Typography>Admin</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link to="/configuration-master" style={{ textDecoration: 'none', color: 'black' }}>
                Configuration Master
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/admin-master" style={{ textDecoration: 'none', color: 'black' }}>
                Admin Master
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/department-master" style={{ textDecoration: 'none', color: 'black' }}>
                Department Master
              </Link>
            </MenuItem>
          </Menu>
        </Box>
        <div className="navbar-actions">
          {showWatchlist && (
            <Link to="/watchlist" className="navbar-link">
              <Tooltip title="Watch List" className="navbar-tooltip">
                <PersonSearchOutlinedIcon className="navbar-icon" />
              </Tooltip>
            </Link>
          )}
          {userName && (
            <>
              <Typography variant="h6" className="navbar-username">
                {userName}
              </Typography>
            </>
          )}
        </div>
      </Box>
    </div>
  )
}

export default Navbar
