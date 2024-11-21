
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {BrowserRouter , Route, Routes, useNavigate,  } from 'react-router-dom';
import NextComponents from "./components/NextComponents";
import Main from "./components/Main";
import EmployeeHistory from "./components/EmployeeHistory";
import Watchlist from "./components/Watchlist";
import Watchlistform from "./components/Watchlistform"
import Navbar from "./components/Navbar";
import EditWatchlistForm from "./components/EditWatchlistForm";
import { useMsal } from '@azure/msal-react';
import axios from "axios";
import MFALogin from "./components/MFALogin";

function App() {
  const { accounts } = useMsal();
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [userRoles, setUserRoles] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  // const url = "http://localhost:5000/api";
  // const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
  const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
  console.log("APPURL" , url)

  console.log("app", username)
  console.log("App" , accounts)

  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      const username = accounts[0].name;
      setUsername(username);
      localStorage.setItem("username", username);

      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${url}/userroles`, {
            params: { email: accounts[0].username }
          });
          console.log("APPDATA"  ,response)
          const roles = response.data;
          setUserRoles(roles);
          const hasAccess = roles.some(role => role.RoleID === 1 || role.RoleID === 3);
          setShowWatchlist(hasAccess);
        } catch (error) {
          console.error('Error fetching user roles:', error);
        }
      };

      fetchUserRole();
    } else {
      localStorage.removeItem("username");
      setShowWatchlist(false);
    }
  }, [accounts]);
  useEffect(() => {
    if (username) {
        navigate('/showWatchlist');
    }
}, [username]);

  return (
    <Box sx={{ flexGrow: 1 }}>
         <Navbar username ={username} showWatchlist ={showWatchlist} />  
     <Routes>

     <Route path="/" element={<MFALogin/>} />

     <Route path="/showWatchlist" element= {<Main username={username} showWatchlist={showWatchlist} userRoles={userRoles}/>}/> 
     <Route path="/nextComponents" element= {<NextComponents/>}/> 
     <Route path="/EmpHistory/:empId/:year/:month" element={<EmployeeHistory  username={username}/>}/>
     <Route path="/watchlist" element={<Watchlist  username={username} />}/>
     <Route path="/watchlistform" element={<Watchlistform username={username} userRoles={userRoles}  />}/>
     <Route path="/watchlistform/:id" element={<EditWatchlistForm username={username} />} />

    </Routes>
    
    </Box>
  );
}

export default App;





// import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import {BrowserRouter , Route, Routes,  } from 'react-router-dom';
// import NextComponents from "./components/NextComponents";
// import Main from "./components/Main";
// import EmployeeHistory from "./components/EmployeeHistory";
// import Watchlist from "./components/Watchlist";
// import Watchlistform from "./components/Watchlistform"
// import Navbar from "./components/Navbar";
// import EditWatchlistForm from "./components/EditWatchlistForm";
// import { useMsal } from '@azure/msal-react';
// import { loginRequest } from "./authConfig";
// import axios from "axios";


// function App() {
//   const { accounts, instance } = useMsal();
//   const [username, setUsername] = useState(localStorage.getItem("username") || null);
//   const [userRoles, setUserRoles] = useState([]);
//   const [showWatchlist, setShowWatchlist] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [activeAccount, setActiveAccount] = useState(null);
//   // const url = "http://localhost:5000/api";
//   // const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;
//   const url= `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`
//   console.log("APPURL" , url)

//   console.log("app", username)
//   console.log("App" , accounts)

//   useEffect(() => {
//     if (accounts.length > 0) {
//       const username = accounts[0].name;
//       setUsername(username);
//       localStorage.setItem("username", username);

//       const fetchUserRole = async () => {
//         try {
//           const response = await axios.get(`${url}/userroles`, {
//             params: { email: accounts[0].username }
//           });
//           console.log("APPDATA"  ,response)
//           const roles = response.data;
//           setUserRoles(roles);
//           const hasAccess = roles.some(role => role.RoleID === 1 || role.RoleID === 3);
//           setShowWatchlist(hasAccess);
//         } catch (error) {
//           console.error('Error fetching user roles:', error);
//         }
//       };

//       fetchUserRole();
//     } 
//     else {
//       localStorage.removeItem("username");
//       setShowWatchlist(false);
//     }
//   }, [accounts]);



//   useEffect(() => {
//     const initializeMsal = async () => {
//       try {
//         if (instance && instance.initialize) {
//           await instance.initialize();
//           setIsInitialized(true);
//         } else {
//           console.error("MSAL instance is not available.");
//         }
//       } catch (error) {
//         console.error("Error initializing MSAL:", error);
//       }
//     };
 
//     initializeMsal();
//   }, [instance]);
 
//   useEffect(() => {
//     const loginRedirectAsync = async () => {
//       try {
//         if (isInitialized && instance) {
//           const accounts = instance.getAllAccounts();
//           const activeAccount = instance.getActiveAccount();
//           console.log({ activeAccount });
//           setActiveAccount(activeAccount);
//           // Check if there's an interaction in progress before triggering login redirect
//           const interactionInProgress = accounts.length > 0 || activeAccount;
//           console.log({ interactionInProgress });
//           if (!interactionInProgress) {
//             await instance.loginRedirect(loginRequest);
//           } else {
//             setTimeout(() => {
//               // setActiveAccount(activeAccount);
//             }, 100);
//           }
//         } else {
//           console.error("MSAL instance is not initialized.");
//         }
//       } catch (error) {
//         console.error("Error during login redirect:", error);
//       }
//     };
 
//     loginRedirectAsync();
//   }, [isInitialized, instance]);



//   return (
//     <Box sx={{ flexGrow: 1 }}>
//          <Navbar username ={username} showWatchlist ={showWatchlist} />  
//      <Routes>
//      <Route path="/" element= {<Main username={username} showWatchlist={showWatchlist} userRoles={userRoles}/>}/> 
//      <Route path="/nextComponents" element= {<NextComponents/>}/> 
//      <Route path="/EmpHistory/:empId/:year/:month" element={<EmployeeHistory  username={username}/>}/>
//      <Route path="/watchlist" element={<Watchlist  username={username} />}/>
//      <Route path="/watchlistform" element={<Watchlistform username={username} userRoles={userRoles}  />}/>
//      <Route path="/watchlistform/:id" element={<EditWatchlistForm username={username} />} />
//     </Routes>
    
//     </Box>
//   );
// }

// export default App;























