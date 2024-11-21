import React from "react";
import {Route, Routes} from "react-router-dom";
import Main from "../components/Main";
import EmployeeHistory from "../components/EmployeeHistory";
import Watchlist from "../components/Watchlist";
import Watchlistform from "../components/Watchlistform";
import EditWatchlistForm from "../components/EditWatchlistForm";
import MFALogin from "../components/MFALogin";


const ApplictionRoutes = ({userRoles , username}) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MFALogin />} />

        <Route
          path="/home"
          element={
            <Main
              username={username}
            //   showWatchlist={Watchlist}
              userRoles={userRoles}
            />
          }
        />
        <Route
          path="/EmpHistory/:empId/:year/:month"
          element={<EmployeeHistory username={username} />}
        />
        <Route path="/watchlist" element={<Watchlist username={username} />} />
        <Route
          path="/watchlistform"
          element={<Watchlistform username={username} userRoles={userRoles} />}
        />
        <Route
          path="/watchlistform/:id"
          element={<EditWatchlistForm username={username} />}
        />
      </Routes>
    </>
  );
};

export default ApplictionRoutes;
