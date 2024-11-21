

import ReactDOM from 'react-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { config } from './authConfig'; // Import your MSAL configuration
import {msalConfig} from "./authConfig"
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const msalInstance = new PublicClientApplication(config);
// const msalInstance = new PublicClientApplication(msalConfig);
console.log('msalInstance isss', msalInstance);
ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MsalProvider>,
  document.getElementById('root')
);





// import { MsalProvider } from '@azure/msal-react';
// import { PublicClientApplication } from '@azure/msal-browser';
// import { config } from './authConfig'; // Import your MSAL configuration
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import { UserProvider } from './UserContext'; // Import the UserProvider

// const msalInstance = new PublicClientApplication(config);

// ReactDOM.render(
//   <MsalProvider instance={msalInstance}>
//     <BrowserRouter>
//       <UserProvider> {/* Wrap the App with UserProvider */}
//         <App />
//       </UserProvider>
//     </BrowserRouter>
//   </MsalProvider>,
//   document.getElementById('root')
// );





















