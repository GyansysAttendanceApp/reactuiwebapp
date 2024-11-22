import ReactDOM from "react-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { config } from "./authConfig";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";

const msalInstance = new PublicClientApplication(config);
ReactDOM.render(
    <MsalProvider instance={msalInstance}>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </MsalProvider>,
  document.getElementById("root")
);
