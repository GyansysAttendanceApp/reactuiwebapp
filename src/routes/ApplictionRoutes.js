import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import EmployeeHistory from '../components/pages/EmployeeHistory'
import Watchlistform from '../components/pages/Watchlistform'
import EditWatchlistForm from '../components/pages/EditWatchlistForm'
import Watchlist from '../components/pages/Watchlist'
import PageNotFound from '../components/errors/PageNotFound'
import ErrorBoundary from '../components/errors/ErrorBoundary'
import Datatable from '../components/pages/Datatable'

const ApplictionRoutes = ({ userRoles, username }) => {
  return (
    <>
      <ErrorBoundary>       
          <Routes>
            <Route path="/" element={<Datatable />} />
            <Route path="/EmpHistory/:empId/:year/:month" element={<EmployeeHistory />} />
            <Route
              // path="/"
              path="/watchlist"
              element={<Watchlist username={username} />}
            />
            <Route
              path="/watchlistform"
              element={<Watchlistform username={username} userRoles={userRoles} />}
            />
            <Route path="/watchlistform/:id" element={<EditWatchlistForm username={username} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>       
      </ErrorBoundary>
    </>
  )
}

export default ApplictionRoutes
