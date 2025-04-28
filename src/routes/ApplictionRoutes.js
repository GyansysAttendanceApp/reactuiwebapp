import React, { useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import EmployeeHistory from '../components/pages/EmployeeHistory';
import Watchlistform from '../components/pages/Watchlistform';
import EditWatchlistForm from '../components/pages/EditWatchlistForm';
import Watchlist from '../components/pages/Watchlist';
import PageNotFound from '../components/Errors/PageNotFound';
import ErrorBoundary from '../components/Errors/ErrorBoundary';
import Datatable from '../components/pages/Datatable';
import UserContext from '../context/UserContext';
import Updatepage from '../components/pages/Updatepage';
import DepartmentDayWiseReport from '../components/pages/DepartmentDaywiseReport';
import DepartmentMonthWiseReport from '../components/pages/DepartmentMonthWiseReport';
import Dashboard from '../components/pages/Dashboard';
import Loginpage from '../components/pages/Loginpage';
import { ThemeProvider } from '@emotion/react';
import theme from '../components/themes/DepartmentMonthWiseReportTheme';
import watchlistTheme from '../components/themes/watchListTheme';
import EmployeeStatus from '../components/pages/Employeereporting';

const ApplictionRoutes = () => {
  const { user: username, userRoles, isAutheriseUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route
            // path="/"
            path="/dashboard"
            element={<Dashboard username={username} />}
          />
          <Route path="/" element={<Datatable />} />
          <Route path="/EmpHistory/:empId/:year/:month" element={<EmployeeHistory />} />
          <Route
            // path="/"
            path="/watchlist"
            element={<Watchlist username={username} />}
          />
          <Route
            path="/watchlistform"
            element={
              <ThemeProvider theme={watchlistTheme}>
                <Watchlistform username={username} userRoles={userRoles} />
              </ThemeProvider>
            }
          />
          <Route 
          path='/EmployeeStatus'
          element={<EmployeeStatus/>}
          />
          <Route
            path="/Updatepage"
            element={<Updatepage username={username} userRoles={userRoles} />}
          />
          <Route path="/DepartmentDayWiseReport" element={<DepartmentDayWiseReport />} />
          <Route
            path="/DepartmentMonthWiseReport/:operationId/:deptId/:year/:month/:subDeptId"
            element={
              <ThemeProvider theme={theme}>
                <DepartmentMonthWiseReport />
              </ThemeProvider>
            }
          />
          <Route path="/Login" element={<Loginpage username={username} />} />
          <Route path="/watchlistform/:id" element={<EditWatchlistForm username={username} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default ApplictionRoutes;
