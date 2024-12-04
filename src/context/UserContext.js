import { useMsal } from '@azure/msal-react';
import dayjs from 'dayjs';
import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { accounts } = useMsal();
  const [ isAutheriseUser, setIsAutheriseUser ] = useState(localStorage.getItem('active'));
  const [userDetails, setUserDetails ] = useState({
    email: 'test@gyansys.com',
    name:'test user',
    password: 'PSN@12345',
  });
  const [user, setUser] = useState(() => accounts[0] && accounts[0].name);
  const [userRoles, setUserRoles] = useState(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [selectedWatchListDate, setSelectedWatchListDateValue] = useState(dayjs(new Date()));

  const [selectedFormatedWatchListDate, setSelectedFormatedWatchListDate] = useState(
    dayjs(new Date()).format('YYYY-MM-DD'),
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemAllEntries, setSelectedItemAllEntries] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [query, setQueryValue] = useState('');
  const [activeApiCall, setActiveApiCall] = useState(true);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentDataLoading, setDepartmentDataLoading] = useState(true);
  const [employeeDetailsLoading, setEmployeeDetailsLoading] = useState(true);
  const [departmentSuggestion, setDepartmentSuggestion] = useState([]);

  const updateUser = (user) => setUser((prevState) => user);
  const updateUserRoles = (userRoles) => setUserRoles((prevState) => userRoles);
  const setQuery = (query) => {
    setActiveApiCall(true);
    setQueryValue(query);
  };
  const setSelectedWatchListDate = (value) => {
    setSelectedWatchListDateValue(value);
    setActiveApiCall(true);
  };
  // const updateUserRoles = (userRoles) => setUserRoles((prevState) => (userRoles));

  const userInfo = {
    user,
    userRoles,
    showWatchlist,
    selectedWatchListDate,
    selectedFormatedWatchListDate,
    query,
    selectedItem,
    selectedItemAllEntries,
    masterData,
    activeApiCall,
    departmentData,
    employeeDetailsLoading,
    departmentDataLoading,
    departmentSuggestion,
    isAutheriseUser,
    setIsAutheriseUser,
    userDetails,
    setUserDetails,
    setDepartmentSuggestion,
    setEmployeeDetailsLoading,
    setDepartmentDataLoading,
    setDepartmentData,
    setActiveApiCall,
    setMasterData,
    setSelectedItem,
    setSelectedItemAllEntries,
    setQuery,
    setSelectedFormatedWatchListDate,
    setSelectedWatchListDate,
    setUserRoles,
    setShowWatchlist,
    updateUser,
    updateUserRoles,
  };

  return <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>;
};

export default UserContext;
