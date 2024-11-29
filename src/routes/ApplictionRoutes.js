import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import EmployeeHistory from '../components/pages/EmployeeHistory'
import Watchlistform from '../components/pages/Watchlistform'
import EditWatchlistForm from '../components/pages/EditWatchlistForm'
import Watchlist from '../components/pages/Watchlist'
import PageNotFound from '../components/errors/PageNotFound'
import ErrorBoundary from '../components/errors/ErrorBoundary'
import Datatable from '../components/pages/Datatable'
import UserContext from '../context/UserContext'
import Updatepage from '../components/pages/Updatepage'
import DepartmentDaywiseReport from "../components/pages/DepartmentDaywiseReport"

const ApplictionRoutes = () => {
  const { user: username, userRoles } = useContext(UserContext)
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

               <Route
              path="/Updatepage"
              element={<Updatepage username={username} userRoles={userRoles} />}
            />
             <Route
              path="/DepartmentDaywiseReport"
              element={<DepartmentDaywiseReport username={username} userRoles={userRoles} />}
            />
            <Route path="/watchlistform/:id" element={<EditWatchlistForm username={username} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>       
      </ErrorBoundary>
    </>
  )
}

export default ApplictionRoutes
