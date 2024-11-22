import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Main from "../components/pages/Main";
import EmployeeHistory from "../components/pages/EmployeeHistory";
import Watchlistform from "../components/pages/Watchlistform";
import EditWatchlistForm from "../components/pages/EditWatchlistForm";
// import Main from "../components/pages/Main";
// import EmployeeHistory from "../components/pages/EmployeeHistory";
import Watchlist from "../components/pages/Watchlist";
// import Watchlistform from "../components/pages/Watchlistform";
// import EditWatchlistForm from "../components/pages/EditWatchlistForm";
import PageNotFound from "../components/errors/PageNotFound";
 import ErrorBoundary from "../components/errors/ErrorBoundary";

const ApplictionRoutes = ({ userRoles, username }) => {
  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/EmpHistory/:empId/:year/:month"

            element={<EmployeeHistory />}
          />
          <Route
            path="/watchlist"
            element={<Watchlist username={username} />}
          />
          <Route
            path="/watchlistform"
            element={
              <Watchlistform username={username} userRoles={userRoles} />
            }
          />
          <Route
            path="/watchlistform/:id"
            element={<EditWatchlistForm username={username} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default ApplictionRoutes;
