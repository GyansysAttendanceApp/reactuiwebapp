import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import { useMsal } from '@azure/msal-react'
import "../../style/watchlistform.scss"

function Watchlistform({ username }) {
  const { instance, accounts } = useMsal()
  const [watchlistName, setWatchlistName] = useState('')
  const [watchlistDescription, setWatchlistDescription] = useState('')
  const [WatchListPrimaryOwner, setWatchListPrimaryOwner] = useState({ name: '', email: '' })
  const [employeesInWatchlist, setEmployeesInWatchlist] = useState([])
  const [ownerSuggestions, setOwnerSuggestions] = useState([])
  const [employeeSuggestions, setEmployeeSuggestions] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const navigate = useNavigate()
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`

  useEffect(() => {
    const fetchOwnerSuggestions = async () => {
      try {
        const response = await axios.get(`${url}/employees?name=${WatchListPrimaryOwner.name}`)
        setOwnerSuggestions(
          response.data.map((item) => ({ name: item.EmpName, email: item.EmpEmail })),
        )
      } catch (error) {
        console.error('Error fetching owner suggestions:', error)
      }
    }

    if (WatchListPrimaryOwner.name.trim() !== '') {
      fetchOwnerSuggestions()
    } else {
      setOwnerSuggestions([])
    }
  }, [WatchListPrimaryOwner.name])

  const fetchEmployeeSuggestions = async (inputValue) => {
    try {
      const response = await axios.get(`${url}/employees?name=${inputValue}`)
      setEmployeeSuggestions(
        response.data.map((item) => ({
          EmployeeID: item.EmpID,
          EmployeeName: item.EmpName,
          EmployeeEmail: item.EmpEmail,
        })),
      )
    } catch (error) {
      console.error('Error fetching employee suggestions:', error)
    }
  }

  const handleSave = async () => {
    const isValid = validateForm()
    if (isValid) {
      try {
        await axios.post(`${url}/watchlist/create`, {
          param_LoggedInUserEmail: accounts[0].username,
          param_WatchListName: watchlistName,
          param_WatchListDescription: watchlistDescription,
          param_WatchListPrimaryOwnerName: WatchListPrimaryOwner.name,
          param_WatchListPrimaryOwnerEmail: WatchListPrimaryOwner.email,
          param_tvp_WatchListEmployees: employeesInWatchlist,
        })
        console.log('Watchlist created successfully')
        setSnackbarMessage('Watchlist created successfully!')
        setSnackbarSeverity('success')
        setOpenSnackbar(true)
        // setWatchlistName("");
        // setWatchlistDescription("");
        // setWatchListPrimaryOwner({ name: "", email: "" });
        // setEmployeesInWatchlist([]);
      } catch (error) {
        console.error(' watchlistformError creating watchlist:', error)
        setSnackbarMessage('Error creating watchlist already exist')
        setSnackbarSeverity('error')
        setOpenSnackbar(true)
      }
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    // debugger
    setOpenSnackbar(false)
    if (snackbarSeverity === 'error') {
      return
    }
    navigate('/watchlist')
  }

  const handleCancel = () => {
    setWatchlistName('')
    setWatchlistDescription('')
    setWatchListPrimaryOwner({ name: '', email: '' })
    setEmployeesInWatchlist([])
    clearFormErrors()
  }

  const clearFormErrors = () => {
    setFormErrors({})
  }
  // Valodation
  const validateForm = () => {
    const errors = {}
    if (!watchlistName.trim()) {
      errors.watchlistName = 'Watchlist name is required'
    }
    if (!watchlistDescription.trim()) {
      errors.watchlistDescription = 'Watchlist description is required'
    }
    if (!WatchListPrimaryOwner.name) {
      errors.WatchListPrimaryOwnerName = 'Please select the owner'
    }
    if (
      WatchListPrimaryOwner.name &&
      !ownerSuggestions.some((owner) => owner.name === WatchListPrimaryOwner.name)
    ) {
      errors.WatchListPrimaryOwnerName = 'Invalid owner name'
    }
    if (employeesInWatchlist.length === 0) {
      errors.employeesInWatchlist = 'Employees list is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Box
        className="header-box" >
        <Link to="/watchlist">
          <Button variant="contained" color="primary">
            Back
          </Button>
        </Link>
        <Typography variant="h6">Watch List Maintenance</Typography>
      </Box>

      <Box className ="form-container">    {/*  px={2} pt={2} */}
        <Typography variant="h5" gutterBottom>
          New Watchlist Creation
        </Typography>
        <Box  className = "form-content " >   {/*display="flex" flexDirection="column" width="100%" margin="0 auto" mt={2}*/}
          <Box className="form-field " >    {/*mb={2} display="flex" alignItems="center" */}
            <Typography variant="subtitle1" style={{ marginRight: '10px', width: '250px' }}>
              Watchlist Name:
            </Typography>
            <TextField
              label="Watchlist Name"
              variant="outlined"
              fullWidth
              value={watchlistName}
              onChange={(e) => setWatchlistName(e.target.value)}
              error={Boolean(formErrors.watchlistName)}
              helperText={formErrors.watchlistName}
              style={{ width: '70%' }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography variant="subtitle1" style={{ marginRight: '10px', width: '250px' }}>
              Watchlist Description:
            </Typography>
            <TextField
              label="Watchlist Description"
              variant="outlined"
              fullWidth
              value={watchlistDescription}
              onChange={(e) => setWatchlistDescription(e.target.value)}
              error={Boolean(formErrors.watchlistDescription)}
              helperText={formErrors.watchlistDescription}
              style={{ width: '70%' }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography variant="subtitle1" style={{ marginRight: '10px', width: '250px' }}>
              Watchlist Owner:
            </Typography>
            <Autocomplete
              style={{ width: '70%' }}
              fullWidth
              value={WatchListPrimaryOwner}
              onChange={(event, value) =>
                setWatchListPrimaryOwner(value || { name: '', email: '' })
              }
              inputValue={WatchListPrimaryOwner.name}
              onInputChange={(event, newInputValue) => {
                setWatchListPrimaryOwner({ name: newInputValue || '', email: '' })
              }}
              options={ownerSuggestions}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Watchlist Owner Name"
                  variant="outlined"
                  error={Boolean(formErrors.WatchListPrimaryOwnerName)}
                  helperText={formErrors.WatchListPrimaryOwnerName}
                />
              )}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography variant="subtitle1" style={{ marginRight: '10px', width: '250px' }}>
              Employees in Watch list:
            </Typography>
            <Autocomplete
              style={{ width: '70%' }}
              multiple
              options={employeeSuggestions}
              value={employeesInWatchlist}
              onChange={(event, newValue) => {
                setEmployeesInWatchlist(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                fetchEmployeeSuggestions(newInputValue)
              }}
              getOptionLabel={(option) => option.EmployeeName}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.EmployeeName}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select one or more Employees"
                  variant="outlined"
                  error={Boolean(formErrors.employeesInWatchlist)}
                  helperText={formErrors.employeesInWatchlist}
                />
              )}
            />
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginRight: '10px' }}
            >
              Save
            </Button>
            <Button variant="contained" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Watchlistform

 


