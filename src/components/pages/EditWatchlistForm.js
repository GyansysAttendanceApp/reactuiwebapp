import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Autocomplete, Chip } from '@mui/material';
import { useMsal } from '@azure/msal-react';
import Footer from '../../components/common/Footer';

function EditWatchlistForm({ username }) {
  const { id } = useParams();
  const { accounts } = useMsal();
  const email = accounts[0].username;
  const [watchlist, setWatchlist] = useState({
    WatchListName: '',
    WatchListDescription: '',
    WatchListPrimaryOwnerName: '',
    EmployeesinWatchlist: '',
  });
  const [employeeNames, setEmployeeNames] = useState([]);
  const [ownerSuggestions, setOwnerSuggestions] = useState([]);
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`${url}/watchlistdetails/${email}/${id}`);
        if (response.data.length > 0) {
          const watchlistData = response.data[0];
          setWatchlist({
            WatchListName: watchlistData.WatchListName,
            WatchListDescription: watchlistData.WatchListDescription,
            WatchListPrimaryOwnerName: watchlistData.WatchListPrimaryOwnerName,
            EmployeesinWatchlist: '',
          });
          const employees = response.data.map((item) => ({
            EmployeeID: item.EmployeeID,
            EmployeeName: item.EmployeeName,
            EmployeeEmail: item.EmployeeEmail,
          }));
          setEmployeeNames(employees);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [email, id]);

  useEffect(() => {
    const fetchOwnerSuggestions = async () => {
      if (watchlist.WatchListPrimaryOwnerName.trim() !== '') {
        try {
          const response = await axios.get(
            `${url}/employees?name=${watchlist.WatchListPrimaryOwnerName}`,
          );
          setOwnerSuggestions(
            response.data.map((item) => ({
              EmployeeID: item.EmpID,
              EmployeeName: item.EmpName,
              EmployeeEmail: item.EmpEmail,
            })),
          );
        } catch (error) {
          console.error('Error fetching owner suggestions:', error);
        }
      } else {
        setOwnerSuggestions([]);
      }
    };
    fetchOwnerSuggestions();
  }, [watchlist.WatchListPrimaryOwnerName]);

  const fetchEmployeeSuggestions = async (inputValue) => {
    try {
      const response = await axios.get(`${url}/employees?name=${inputValue}`);
      setEmployeeSuggestions(
        response.data.map((item) => ({
          EmployeeID: item.EmpID,
          EmployeeName: item.EmpName,
          EmployeeEmail: item.EmpEmail,
        })),
      );
    } catch (error) {
      console.error('Error fetching employee suggestions:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatchlist((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        await axios.put(`${url}/watchlist/${id}`, {
          param_LoggedInUserEmail: email,
          param_WatchListID: id,
          param_WatchListName: watchlist.WatchListName,
          param_WatchListDescription: watchlist.WatchListDescription,
          param_WatchListPrimaryOwnerName: watchlist.WatchListPrimaryOwnerName,
          param_WatchListPrimaryOwnerEmail: email,
          param_tvp_WatchListEmployees: employeeNames,
        });
        navigate('/watchlist');
      } catch (error) {
        console.error('Error updating watchlist:', error);
      }
    }
  };

  // Function to validate the form
  const validateForm = () => {
    const errors = {};
    if (!watchlist.WatchListName.trim()) errors.watchlistName = 'Watchlist name is required';
    if (!watchlist.WatchListDescription.trim())
      errors.watchlistDescription = 'Watchlist description is required';
    if (!watchlist.WatchListPrimaryOwnerName) errors.watchlistOwner = 'Please select the owner';
    if (
      !ownerSuggestions.some((owner) => owner.EmployeeName === watchlist.WatchListPrimaryOwnerName)
    )
      errors.watchlistOwner = 'Invalid owner name';
    if (employeeNames.length === 0) errors.employeesInWatchlist = 'Employees list is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <Box px={2} pt={2} textAlign="" minHeight="calc(100vh - 128px)">
        <Typography variant="h5" gutterBottom>
          Edit Watchlist
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" width="100%" margin="0 auto" mt={2}>
            <Box mb={2} display="flex" alignItems="center">
              <Typography variant="subtitle1" style={{ marginRight: '10px', width: '250px' }}>
                Watchlist Name:
              </Typography>
              <TextField
                label="Watchlist Name"
                variant="outlined"
                fullWidth
                name="WatchListName"
                value={watchlist.WatchListName}
                onChange={handleChange}
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
                name="WatchListDescription"
                value={watchlist.WatchListDescription}
                onChange={handleChange}
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
                value={watchlist.WatchListPrimaryOwnerName}
                onChange={(event, value) =>
                  setWatchlist((prevState) => ({
                    ...prevState,
                    WatchListPrimaryOwnerName: value || '',
                  }))
                }
                inputValue={watchlist.WatchListPrimaryOwnerName}
                onInputChange={(event, newInputValue) =>
                  setWatchlist((prevState) => ({
                    ...prevState,
                    WatchListPrimaryOwnerName: newInputValue || '',
                  }))
                }
                options={ownerSuggestions.map((option) => option.EmployeeName)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Watchlist Owner Name"
                    variant="outlined"
                    error={Boolean(formErrors.watchlistOwner)}
                    helperText={formErrors.watchlistOwner}
                  />
                )}
              />
            </Box>
            <Box mb={2} display="flex" alignItems="center">
              <Typography variant="subtitle1" style={{ marginRight: '10px', width: '250px' }}>
                Employees in Watchlist:
              </Typography>
              <Autocomplete
                style={{ width: '70%' }}
                multiple
                options={employeeSuggestions}
                value={employeeNames}
                getOptionLabel={(option) => option.EmployeeName}
                onChange={(event, newValue) => setEmployeeNames(newValue)}
                onInputChange={(event, newInputValue) => fetchEmployeeSuggestions(newInputValue)}
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
                type="submit"
                style={{ marginRight: '10px' }}
              >
                Update
              </Button>
              <Button variant="contained" onClick={() => navigate('/watchlist')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default EditWatchlistForm;
