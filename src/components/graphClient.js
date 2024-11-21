// graphClient.js
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { msalConfig } from './authConfig';

const getGraphClient = (msalInstance, account) => {
  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
    account: account,
    scopes: ["User.Read"]
  });

  return Client.initWithMiddleware({ authProvider });
};

export default getGraphClient;
