import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { BiMale, BiFemale } from 'react-icons/bi'
import { GoMail } from 'react-icons/go'
import { VscOrganization } from 'react-icons/vsc'
import { PiMicrosoftTeamsLogoFill } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMsal } from '@azure/msal-react'
import UserContext from '../../context/UserContext'
import DateComponent from '../common/DateComponent'
import dayjs from 'dayjs'
import constraints from '../../constraints'
import { CircularProgress } from '@mui/material'

function Datatable() {
  const { instance, accounts } = useMsal()
  console.log(accounts, 'datatable')
  console.log(instance, 'INdatatable')
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemAllEntries, setSelectedItemAllEntries] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [masterData, setMasterData] = useState([])
  // const [CurDate, setCurDate] = useState("");
  const [departmentData, setDepartmentData] = useState([])
  const [sortOrder, setSortOrder] = useState({ column: '', direction: '' })
  const [error, setError] = useState('')
  // const [dtCurrentDate, setDtCurrentDate] = useState("");
  const [totalExpectedCount, setTotalExpectedCount] = useState(0)
  const [totalTodaysCount, setTotalTodaysCount] = useState(0)
  // const [currentTime, setCurrentTime] = useState(""); // for current time
  const [fetchHistoryError, setFetchHistoryError] = useState('')
  const [departmentDataLoading, setDepartmentDataLoading] = useState(true)
  const [employeeDetailsLoading, setEmployeeDetailsLoading] = useState(true)
  // const [showWatchlist, setShowWatchlist] = useState(false);

  const [watchlist, setWatchlist] = useState([])
  const [selectedWatchListDate, setSelectedWatchListDate] = useState(dayjs(new Date()))
  const [selectedFormatedWatchListDate, setSelectedFormatedWatchListDate] = useState(
    dayjs(new Date()).format('YYYY-MM-DD'),
  )
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`

  const navigate = useNavigate()

  const { showWatchlist } = useContext(UserContext)

  // Function to clear errors after 2 seconds
  useEffect(() => {
    const clearErrors = setTimeout(() => {
      setError('')
      setFetchHistoryError('')
    }, 2000)

    return () => clearTimeout(clearErrors)
  }, [error, fetchHistoryError])

  // Fetch current time
  // useEffect(() => {
  //   const getCurrentTime = () => {
  //     const now = new Date();
  //     const hours = now.getHours().toString().padStart(2, "0");
  //     const minutes = now.getMinutes().toString().padStart(2, "0");
  //     const seconds = now.getSeconds().toString().padStart(2, "0");
  //     return `${hours}:${minutes}:${seconds}`;
  //   };

  //   setCurrentTime(getCurrentTime());
  // }, []);

  // const getCurrentDate = () => {
  //   const today = new Date();

  //   const yyyy = today.getFullYear();
  //   let mm = today.getMonth() + 1; // Months start at 0!
  //   let dd = today.getDate();

  //   if (dd < 10) dd = "0" + dd;
  //   if (mm < 10) mm = "0" + mm;

  //   let formattedDate = `${yyyy}-${mm}-${dd}`;
  //   return formattedDate;
  // };

  /// api call for nameSuggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (!query) {
          setSuggestions([])
          return
        }

        const response = await axios.get(`${url}/employees?name=${query}`)
        const data = response.data
        console.log(' segg contain dataEMployeeID', data)
        setMasterData(data)
        const suggestions = data.map((item) => item.EmpName)
        setSuggestions(suggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    fetchSuggestions()
  }, [query])

  useEffect(() => {
    //const date = "2024-11-15"; // it may work in local to fetch the data while deploying we need to commit this one
    // const date = getCurrentDate(); // this one we need to uncommit while deploying to get the current data and it start working
    // const formattedDateDate = new Date(date);
    // const dateFormat = formattedDateDate.toDateString();
    // setDtCurrentDate(dateFormat);
    // setCurDate(date);
    setDepartmentData([])

    fetchDepartmentData(selectedFormatedWatchListDate)
  }, [selectedFormatedWatchListDate])

  useEffect(() => {
    setTotalExpectedCount(calculateExpectedTotalCount())
    setTotalTodaysCount(calculateTodaysTotalCount())
  }, [departmentData])

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        // const date = getCurrentDate();
        const email = accounts[0].username
        console.log('getwatchlist data in datatable API', email)
        const response = await fetch(`${url}/watchlist/${email}/${selectedFormatedWatchListDate}`)
        const data = await response.json()
        console.log('getwatchlist data in datatable API', data)
        setWatchlist(data)
      } catch (error) {
        console.error('Error fetching watchlist data:', error)
      }
    }
    fetchWatchlistData()
    setSelectedItem(null)
    setSelectedItemAllEntries([])
    handleSearch()
    // handleFetchHistory();
  }, [accounts, selectedFormatedWatchListDate])

  const handleSelectedWatchListDate = (event) => {
    setSelectedFormatedWatchListDate(dayjs(event).format('YYYY-MM-DD'))
    setSelectedWatchListDate(event)
    console.log('date is', dayjs(event).format('DD-MM-YYYY'))
  }

  const fetchDepartmentData = async (date) => {
    try {
      setDepartmentDataLoading(true)

      const response = await axios.get(`${url}/dept?date=${date}`)
      setDepartmentData(response.data)
      setDepartmentDataLoading(false)
    } catch (error) {
      setDepartmentDataLoading(false)

      console.error('Error fetching department data:', error)
    }
  }

  const handleSearch = async () => {
    try {
      if (!query) {
        setError('Please enter a username.')
        setEmployeeDetailsLoading(false)
        return
      }

      if (masterData.length > 0) {
        setEmployeeDetailsLoading(true)
        const response = await axios.get(
          `${url}/attendance/${masterData[0].EmpID}/${selectedFormatedWatchListDate}`,
        )
        const result = response.data
        if (result && result.length > 0) {
          setSelectedItem(result[0])
          setSelectedItemAllEntries(result)
          setEmployeeDetailsLoading(false)
        } else {
          setSelectedItem(null)
          setSelectedItemAllEntries([])
          setEmployeeDetailsLoading(false)
        }
      } else {
        setError('Employee not found!')
      }
    } catch (error) {
      console.error('Error searching employees:', error)
      setEmployeeDetailsLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setSelectedItem(null)
    setSelectedItemAllEntries(null)
  }

  const handleFetchHistory = () => {
    console.log('calling fetch logic :::::::::')

    if (!masterData || masterData.length === 0) {
      setFetchHistoryError('Please Enter a name first.')
    } else {
      const date = new Date()
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      navigate(`/EmpHistory/${masterData[0].EmpID}/${year}/${month}`)
    }
  }

  const handleSort = (column) => {
    const newSortOrder = {
      column: column,
      direction: sortOrder.column === column && sortOrder.direction === 'asc' ? 'desc' : 'asc',
    }

    setSortOrder(newSortOrder)

    const sortedData = [...departmentData].sort((a, b) => {
      if (newSortOrder.direction === 'asc') {
        return a[column] - b[column]
      } else {
        return b[column] - a[column]
      }
    })

    setDepartmentData(sortedData)
  }

  const calculateExpectedTotalCount = () => {
    let totalExpectedCount = 0
    departmentData.forEach((department) => {
      totalExpectedCount += parseInt(department.ExpectedCount)
    })
    return totalExpectedCount
  }

  const calculateTodaysTotalCount = () => {
    let totalTodaysCount = 0
    departmentData.forEach((department) => {
      totalTodaysCount += parseInt(department.TodaysCount)
    })
    return totalTodaysCount
  }

  // useEffect(() => {
  // }, [departmentData]);

  // Function to calculate percentage
  const calculatePercentage = (expected, today) => {
    return expected !== 0 ? ((today / expected) * 100).toFixed() : 0
  }

  // Group watchlist Names by WatchListName
  const groupedWatchlist =
    watchlist.length &&
    watchlist.reduce((acc, curr) => {
      if (!acc[curr.WatchListName]) {
        acc[curr.WatchListName] = []
      }
      acc[curr.WatchListName].push(curr)
      return acc
    }, {})

  // This API is show and hide the watchlist
  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     const email = accounts[0]?.username;
  //     console.log("datatableEMail", email);
  //     try {
  //       const response = await axios.get(`${url}/userroles?email=${email}`);
  //       const roles = response.data;
  //       if (roles.some((role) => role.RoleID === 1 || role.RoleID === 3)) {
  //         setShowWatchlist(true);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user roles: ", error);
  //     }
  //   };

  //   if (accounts[0]?.username) {
  //     fetchUserRole();
  //   }
  // }, [accounts]);

  // useEffect(() => {
  //   if (userRoles && userRoles.length > 0) {
  //     // if (userRoles.length > 0) {
  //     const hasAccess = userRoles.some(
  //       (role) => role.RoleID === 1 || role.RoleID === 3
  //     );
  //     setShowWatchlist(hasAccess);
  //   }
  // }, [userRoles]);

  // Function to fetch watchlist data from the API

  return (
    <Box>
      {/* <Paper elevation={3} sx={{ p: 1 }}> */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          padding: '8px',
          backgroundColor: '#D6EEEE',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {constraints.DATATABLE.ATTENDANCE_COUNT} {totalTodaysCount} / {totalExpectedCount}{' '}
        {constraints.DATATABLE.AS_ON} {selectedFormatedWatchListDate}
      </Typography>
      <Box style={{ padding: '0.5vh 0.5vw 0 0.5vw' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TableContainer component={Paper} sx={{ maxHeight: '77vh', overflow: 'none' }} ś>
              <Table>
                <TableHead sx={{ position: 'sticky', top: 0 }}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {constraints.DATATABLE.DEPARTMENT_NAME}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortOrder.column == 'ExpectedCount'}
                        direction={
                          sortOrder.column == 'ExpectedCount' ? sortOrder.direction : 'asc'
                        }
                        onClick={() => handleSort('ExpectedCount')}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {constraints.DATATABLE.EXPECTED_COUNT}
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortOrder.column == 'TodaysCount'}
                        direction={sortOrder.column == 'TodaysCount' ? sortOrder.direction : 'asc'}
                        onClick={() => handleSort('TodaysCount')}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {constraints.DATATABLE.REPORTED_COUNT}
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {constraints.DATATABLE.ABSENT_COUNT}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {constraints.DATATABLE.ACHIVEMENT_PERCENTAGE}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {departmentData &&
                    departmentData.map((department) => (
                      <TableRow key={department.EmpID}>
                        <TableCell style={{ height: '1vh', padding: '0.5rem' }}>
                          {department.DeptName}
                        </TableCell>
                        <TableCell style={{ height: '1vh', padding: '0.5rem' }}>
                          {department.ExpectedCount}
                        </TableCell>
                        <TableCell style={{ height: '1vh', padding: '0.5rem' }}>
                          {department.TodaysCount}
                        </TableCell>
                        <TableCell style={{ height: '1vh', padding: '0.5rem' }}>
                          {parseInt(department.ExpectedCount) - parseInt(department.TodaysCount)}
                        </TableCell>
                        <TableCell style={{ height: '1vh', padding: '0.5rem' }}>
                          {calculatePercentage(
                            parseInt(department.ExpectedCount),
                            parseInt(department.TodaysCount),
                          )}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
                  {departmentDataLoading && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            minHeight: '20vh',
                            alignItems: 'center',
                            // background: "red",
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {!departmentDataLoading && departmentData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            minHeight: '20vh',
                            alignItems: 'center',
                            // background: "red",
                          }}
                        >
                          <Typography variant="body1">
                            {constraints.DATATABLE.NO_DATA_FOUND}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow
                    sx={{
                      position: 'sticky',
                      bottom: '-1px',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    <TableCell sx={{ height: '1vh', padding: '0.5rem' }}>Total</TableCell>
                    <TableCell sx={{ height: '1vh', padding: '0.5rem' }}>
                      {totalExpectedCount}
                    </TableCell>
                    <TableCell sx={{ height: '1vh', padding: '0.5rem' }}>
                      {totalTodaysCount}
                    </TableCell>
                    <TableCell sx={{ height: '1vh', padding: '0.5rem' }}>
                      {parseInt(totalExpectedCount) - parseInt(totalTodaysCount)}
                    </TableCell>
                    <TableCell sx={{ height: '1vh', padding: '0.5rem' }}>
                      {calculatePercentage(totalExpectedCount, totalTodaysCount)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box id="searchBox">
              <Paper sx={{ padding: '0.8rem' }}>
                <Grid item xs={12} sm={12}>
                  <Box display={'flex'} gap={2}>
                    <Grid item xs={12} sm={9}>
                      <Autocomplete
                        fullWidth
                        value={query}
                        onChange={(event, value) => setQuery(value || '')}
                        inputValue={query}
                        onInputChange={(event, newInputValue) => {
                          setQuery(newInputValue || '')
                        }}
                        options={suggestions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={constraints.DATATABLE.SEARCH.LABEL}
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <DateComponent
                        value={selectedWatchListDate}
                        onchange={(e) => handleSelectedWatchListDate(e)}
                      />
                    </Grid>
                  </Box>
                </Grid>

                <Box mt={2} display={'flex'} gap={'0.8rem'}>
                  <Button variant="contained" onClick={handleSearch}>
                    {constraints.DATATABLE.BUTTON.FETCH}
                  </Button>
                  <Button variant="contained" onClick={handleFetchHistory}>
                    {constraints.DATATABLE.BUTTON.FETCH_HISTORY}
                  </Button>
                  <Button variant="contained" onClick={handleReset}>
                    {constraints.DATATABLE.BUTTON.CLEAR}
                  </Button>
                </Box>
              </Paper>
            </Box>
            <Box mt={2}>
              {selectedItem ? (
                <Card
                  variant="outlined"
                  sx={{
                    boxShadow: 2,
                    bgcolor: selectedItem.SwipeDateTime === 'ABSENT' ? '#f43636d4' : '#90EE90',
                  }}
                >
                  <CardContent sx={{ overflow: 'auto', maxHeight: '54vh' }}>
                    <Typography variant="h6">Search Result</Typography>
                    <Box display="flex" alignItems="center">
                      {selectedItem.EmpGender === 'Male' ? (
                        <BiMale size={28} sx={{ backgroundColor: '#3658f4d4' }} />
                      ) : (
                        <BiFemale size={26} sx={{ backgroundColor: '#d6338f' }} />
                      )}
                      <Typography>
                        {selectedItem.EmpName} ({selectedItem.EmpID})
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <GoMail size={20} sx={{ backgroundColor: '#d6338f' }} />
                      <Typography>
                        &nbsp;
                        <a href={`mailto:${selectedItem.EmpEmail}`} target="_blank">
                          {selectedItem.EmpEmail}
                        </a>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <VscOrganization size={20} sx={{ backgroundColor: '#d6338f' }} />
                      <Typography>&nbsp;{selectedItem.DeptName}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <PiMicrosoftTeamsLogoFill size={20} sx={{ backgroundColor: '#d6338f' }} />
                      <Typography>
                        &nbsp;
                        <a
                          href={`https://teams.microsoft.com/l/chat/0/0?users=${selectedItem.EmpEmail}`}
                          target="_blank"
                        >
                          Chat
                        </a>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      &nbsp;
                    </Box>
                    {selectedItem.SwipeDateTime === 'ABSENT' ? (
                      <Box display="flex" alignItems="center">
                        <Typography>&nbsp;ABSENT</Typography>
                      </Box>
                    ) : (
                      <>
                        <Box display="flex" alignItems="center">
                          <table>
                            <tbody>
                              {selectedItemAllEntries.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {item.SwipeDateTime} - {item.InOut} - {item.FloorDoorName}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Typography variant="body1" color="red">
                    {error}
                  </Typography>
                  {fetchHistoryError && (
                    <Typography variant="contained" color="error">
                      {fetchHistoryError}
                    </Typography>
                  )}
                </>
              )}
              {employeeDetailsLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: '20vh',
                    alignItems: 'center',
                    // background: "red",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>
            {showWatchlist && (
              <Box mt={2}>
                <Accordion sx={{ backgroundColor: '' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: '#5DADE2' }}
                  >
                    <Typography variant="h5" sx={{ color: '#FFFFFF' }}>
                      {constraints.DATATABLE.WATCH_LIST.TITLE}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {Object.entries(groupedWatchlist).map(([watchlistName, employees], index) => (
                        <Accordion key={index} sx={{ marginBottom: '10px' }} defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${watchlistName}-content`}
                            id={`${watchlistName}-header`}
                            sx={{ backgroundColor: '#ECF0F1' }}
                          >
                            <Typography>
                              <em>{watchlistName}</em>
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <TableContainer sx={{ marginTop: '5px' }}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant="h6">
                                        {constraints.DATATABLE.WATCH_LIST.EMPLOYEE_NAME}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="h6">
                                        {constraints.DATATABLE.WATCH_LIST.IN_TIME}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="h6">
                                        {constraints.DATATABLE.WATCH_LIST.OUT_TIME}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {employees.map((employee, i) => (
                                    <TableRow key={i}>
                                      <TableCell>
                                        <a
                                          href={`https://teams.microsoft.com/l/chat/0/0?users=${employee.EmployeeEmail}`}
                                          target="_blank"
                                        >
                                          <PiMicrosoftTeamsLogoFill
                                            size={20}
                                            sx={{
                                              backgroundColor: '#d6338f',
                                            }}
                                          />
                                        </a>
                                        &nbsp;
                                        <a
                                          href={`mailto:${employee.EmployeeEmail}`}
                                          style={{ textDecoration: 'none' }}
                                        >
                                          {employee.EmployeeName}
                                        </a>
                                      </TableCell>
                                      <TableCell align="right">{employee.InTime}</TableCell>
                                      <TableCell align="right">{employee.OutTime}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Box>
    </Box>
  )
}

export default Datatable
