import react, { Suspense } from "react";
import Datatable from "./Datatable";
import Navbar from "./Navbar";
import Footer from "./Footer";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import UserContext from "../context/UserContext";

const Main = () => {
  return (
    <div>
      {/* <Navbar username ={username} showWatchlist ={showWatchlist} />  */}
      <Datatable />

      <Footer />
    </div>
  );
};
export default Main;

// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import Datatable from "./Datatable";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { BrowserRouter as Router } from 'react-router-dom';
// import { useMsal } from '@azure/msal-react';

// const Main = () => {
//   const { accounts } = useMsal();
//   const [username, setUsername] = useState(localStorage.getItem("username") || null);
//   const [userRoles, setUserRoles] = useState([]);
//   const [showWatchlist, setShowWatchlist] = useState(false);

//   useEffect(() => {
//     if (accounts.length > 0) {
//       const username = accounts[0].name;
//       setUsername(username);
//       localStorage.setItem("username", username);

//       const fetchUserRole = async () => {
//         try {
//           const response = await axios.get(`http://localhost:5000/api/userroles`, {
//             params: { email: accounts[0].username }
//           });
//           const roles = response.data;
//           setUserRoles(roles);
//           const hasAccess = roles.some(role => role.RoleID === 1 || role.RoleID === 3);
//           setShowWatchlist(hasAccess);
//         } catch (error) {
//           console.error('Error fetching user roles:', error);
//         }
//       };

//       fetchUserRole();
//     } else {
//       localStorage.removeItem("username");
//       setShowWatchlist(false);
//     }
//   }, [accounts]);

//   return (

//       <div>
//         <Navbar username={username} showWatchlist={showWatchlist} />
//         <Datatable userRoles={userRoles} />
//         <Footer />
//       </div>

//   );
// };

// export default Main;
