import { useMsal } from '@azure/msal-react'
import React, { createContext, useState } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { instance, accounts } = useMsal()
  const [user, setUser] = useState(() => accounts[0] && accounts[0].name)
  const [userRoles, setUserRoles] = useState(null)
  const [showWatchlist, setShowWatchlist] = useState(false)

  const updateUser = (user) => setUser((prevState) => user)
  const updateUserRoles = (userRoles) => setUserRoles((prevState) => userRoles)
  // const updateUserRoles = (userRoles) => setUserRoles((prevState) => (userRoles));

  const userInfo = {
    user,
    userRoles,
    showWatchlist,
    setUserRoles,
    setShowWatchlist,
    updateUser,
    updateUserRoles,
  }

  return <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
}

export default UserContext
