import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Main from "../components/Main";
import EmployeeHistory from "../components/EmployeeHistory";
import Watchlist from "../components/Watchlist";
import Watchlistform from "../components/Watchlistform";
import EditWatchlistForm from "../components/EditWatchlistForm";
import PageNotFound from "../components/Errors/PageNotFound";
import ErrorBoundary from "../components/Errors/ErrorBoundary";

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
