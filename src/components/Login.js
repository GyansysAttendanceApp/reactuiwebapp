import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig'; // Import loginRequest from authConfig

function Login() {
  const { instance } = useMsal();

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLoginRedirect}>Login</button>
    </div>
  );
}

export default Login;
