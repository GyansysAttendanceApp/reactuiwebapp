import React, { createContext, useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (accounts.length > 0) {
        const account = accounts[0];
        const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(instance, {
          account,
          scopes: ["User.Read"]
        });

        const graphClient = Client.initWithMiddleware({ authProvider });

        try {
          const userDetails = await graphClient.api('/me').get();
          setUser(userDetails);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        try {
          await instance.loginRedirect(loginRequest);
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
    };

    fetchUser();
  }, [instance, accounts]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
