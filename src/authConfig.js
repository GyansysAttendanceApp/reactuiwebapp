const config = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: process.env.REACT_APP_AZURE_TENANT_URL,
    redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URL, // Update with your redirect URI
    postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
}

const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
}

export { config, loginRequest }
