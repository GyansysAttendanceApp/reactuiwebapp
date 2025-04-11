import React, { useContext, useEffect, useState } from 'react';
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
import { getToken, fetchSecureData } from './services/TokenService';

function App() {
  const { accounts } = useMsal();
  const { setUserRoles, setShowWatchlist } = useContext(UserContext);
  const [secureToken, setSecureToken] = useState(null);
  const navigate = useNavigate();
  const { isAutheriseUser } = useContext(UserContext);

  const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
 

    // 🔐 When user logs in, fetch secure backend token
    useEffect(() => {
      const initAuthFlow = async () => {
        if (accounts.length > 0 && !secureToken) {
          try {
            const token = await getToken(); // call Node backend with API ID + key
            setSecureToken(
              token
            
            );
            
          } catch (err) {
            console.error('Error getting secure token:', err);
          }
        }
      };
      initAuthFlow();
    }, [accounts, secureToken]);

    

  useEffect(() => {
    if (accounts.length > 0 && secureToken) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${url}/userroles`, {
            params: { email: accounts[0].username },
            headers: {
              Authorization: `Bearer ${secureToken}`,
            },
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
  }, [accounts, setUserRoles, setShowWatchlist, url,secureToken]);
  console.log(accounts);



  return (
      <Layout>
        {/* {isAutheriseUser ? <ApplictionRoutes /> : <Loginpage />} */}

        <AuthenticatedTemplate>
            <ApplictionRoutes />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <MFALogin />
          </UnauthenticatedTemplate>     
      </Layout>
  );
}

export default App;
