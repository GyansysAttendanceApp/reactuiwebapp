import React, { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';

import ApplictionRoutes from './routes/ApplictionRoutes';
import Navbar from './components/common/Navbar';
import UserContext from './context/UserContext';
import MFALogin from './components/pages/MFALogin';
import axios from 'axios';
import { Typography } from '@mui/material';
import { setCssVariables } from './colors/colorsVariables';
import Layout from './components/common/Layout';
import { useNavigate } from 'react-router-dom';
import Loginpage from './components/pages/Loginpage';

function App() {
  const { accounts } = useMsal();
  const { setUserRoles, setShowWatchlist } = useContext(UserContext);
  const navigate = useNavigate();
  const { isAutheriseUser } = useContext(UserContext);
  

  const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
 
  useEffect(() => {
    if (accounts.length > 0) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${url}/userroles`, {
            params: { email: accounts[0].username },
          });
          const roles = response.data;
          setUserRoles(roles);
          const hasAccess = roles.some((role) => role.RoleID === 1 || role.RoleID === 3);
          setShowWatchlist(hasAccess);
        } catch (error) {
          console.error('Error fetching user roles:', error);
        }
      };

      fetchUserRole();
    } else {
      setShowWatchlist(false);
    }
  }, [JSON.stringify(accounts)]);

  return (
    <>
      <Layout>
        {isAutheriseUser?<ApplictionRoutes />:<Loginpage/>}

        

        {/* <AuthenticatedTemplate>
            <ApplictionRoutes />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <MFALogin />
          </UnauthenticatedTemplate>      */}
      </Layout>
    </>
  );
}

export default App;
