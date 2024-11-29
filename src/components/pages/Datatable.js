import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { BiMale, BiFemale } from 'react-icons/bi';
import { GoMail } from 'react-icons/go';
import { VscOrganization } from 'react-icons/vsc';
import { PiMicrosoftTeamsLogoFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useMsal } from '@azure/msal-react';
import UserContext from '../../context/UserContext';
import DateComponent from '../common/DateComponent';
import dayjs from 'dayjs';
import constraints from '../../constraints';
import '../../style/Datatable.scss';
import FadeLoader from 'react-spinners/FadeLoader';
import { colors } from '../../colors/Color';
import {Link } from "react-router-dom"

function Datatable() {
  const [sortOrder, setSortOrder] = useState({ column: '', direction: '' });
  const [error, setError] = useState('');
  const [totalExpectedCount, setTotalExpectedCount] = useState(0);
  const [totalTodaysCount, setTotalTodaysCount] = useState(0);
  const [fetchHistoryError, setFetchHistoryError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const navigate = useNavigate();
  const { accounts } = useMsal();
  const {
    departmentData,
    setDepartmentData,
    query,
    setQuery,
    showWatchlist,
    selectedItem,
    selectedItemAllEntries,
    masterData,
    setMasterData,
    setSelectedItem,
    setSelectedItemAllEntries,
    selectedWatchListDate,
    setSelectedWatchListDate,
    selectedFormatedWatchListDate,
    setSelectedFormatedWatchListDate,
    employeeDetailsLoading,
    departmentDataLoading,
    setEmployeeDetailsLoading,
    setDepartmentDataLoading,
  } = useContext(UserContext);
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;

  useEffect(() => {
    const clearErrors = setTimeout(() => {
      setError('');
      setFetchHistoryError('');
    }, 2000);

    return () => clearTimeout(clearErrors);
  }, [error, fetchHistoryError]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (!query) {
          setSuggestions([]);
          return;
        }

        const response = await axios.get(`${url}/employees?name=${query}`);
        const data = response.data;
        setMasterData(data);
        const suggestions = data.map((item) => item.EmpName);
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    fetchSuggestions();
  }, [query]);

  useEffect(() => {
    setDepartmentData([]);
    fetchDepartmentData(selectedFormatedWatchListDate);
  }, [selectedFormatedWatchListDate]);

  useEffect(() => {
    setTotalExpectedCount(calculateExpectedTotalCount());
    setTotalTodaysCount(calculateTodaysTotalCount());
  }, [departmentData]);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        const email = accounts[0].username;
        const response = await fetch(`${url}/watchlist/${email}/${selectedFormatedWatchListDate}`);
        const data = await response.json();
        setWatchlist(data);
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
      }
    };
    setSelectedItem(null);
    setSelectedItemAllEntries([]);
    fetchWatchlistData();
    handleSearch();
  }, [accounts, selectedFormatedWatchListDate]);

  const handleSelectedWatchListDate = (event) => {
    setSelectedFormatedWatchListDate(dayjs(event).format('YYYY-MM-DD'));
    setSelectedWatchListDate(event);
  };

  const fetchDepartmentData = async (date) => {
    try {
      setDepartmentDataLoading(true);

      const response = await axios.get(`${url}/dept?date=${date}`);
      console.log("dataTable", response)
      setDepartmentData(response.data);
      setDepartmentDataLoading(false);
    } catch (error) {
      setDepartmentDataLoading(false);

      console.error('Error fetching department data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (!query) {
        setError('Please enter a username.');
        setEmployeeDetailsLoading(false);
        return;
      }

      if (masterData.length > 0) {
        setEmployeeDetailsLoading(true);
        const response = await axios.get(
          `${url}/attendance/${masterData[0].EmpID}/${selectedFormatedWatchListDate}`,
        );
        const result = response.data;
        if (result && result.length > 0) {
          setSelectedItem(result[0]);
          setSelectedItemAllEntries(result);
          setEmployeeDetailsLoading(false);
        } else {
          setSelectedItem(null);
          setSelectedItemAllEntries([]);
          setEmployeeDetailsLoading(false);
        }
      } else {
        setError('Employee not found!');
      }
    } catch (error) {
      console.error('Error searching employees:', error);
      setEmployeeDetailsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSelectedItem(null);
    setSelectedItemAllEntries(null);
  };

  const handleFetchHistory = () => {
    if (!masterData || masterData.length === 0) {
      setFetchHistoryError('Please Enter a name first.');
    } else {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      navigate(`/EmpHistory/${masterData[0].EmpID}/${year}/${month}`);
    }
  };

  // const handleSort = (column) => {
  //   const newSortOrder = {
  //     column: column,
  //     direction: sortOrder.column === column && sortOrder.direction === 'asc' ? 'desc' : 'asc',
  //   };

  //   setSortOrder(newSortOrder);

  //   const sortedData = [...departmentData].sort((a, b) => {
  //     if (newSortOrder.direction === 'asc') {
  //       return a[column] - b[column];
  //     } else {
  //       return b[column] - a[column];
  //     }
  //   });

  //   setDepartmentData(sortedData);
  // };

  const handleSort = (column) => {
    const isAsc = sortOrder.column === column && sortOrder.direction === 'asc';
    setSortOrder({ column, direction: isAsc ? 'desc' : 'asc' });

    const sortedData = [...departmentData].sort((a, b) => {
      let valueA, valueB;

      switch (column) {
        case 'ExpectedCount':
          valueA = parseInt(a.ExpectedCount);
          valueB = parseInt(b.ExpectedCount);
          break;
        case 'ReportedCount':
          valueA = parseInt(a.TodaysCount);
          valueB = parseInt(b.TodaysCount);
          break;
        case 'AbsentCount':
          valueA = parseInt(a.ExpectedCount) - parseInt(a.TodaysCount);
          valueB = parseInt(b.ExpectedCount) - parseInt(b.TodaysCount);
          break;
        case 'Achieved':
          valueA = calculatePercentage(parseInt(a.ExpectedCount), parseInt(a.TodaysCount));
          valueB = calculatePercentage(parseInt(b.ExpectedCount), parseInt(b.TodaysCount));
          break;
        default:
          return 0;
      }

      return isAsc ? valueA - valueB : valueB - valueA;
    });

    // Replace the original array with the sorted one
    departmentData.splice(0, departmentData.length, ...sortedData);
  };

  const calculateExpectedTotalCount = () => {
    let totalExpectedCount = 0;
    departmentData.forEach((department) => {
      totalExpectedCount += parseInt(department.ExpectedCount);
    });
    return totalExpectedCount;
  };

  const calculateTodaysTotalCount = () => {
    let totalTodaysCount = 0;
    departmentData.forEach((department) => {
      totalTodaysCount += parseInt(department.TodaysCount);
    });
    return totalTodaysCount;
  };

  const calculatePercentage = (expected, today) => {
    return expected !== 0 ? ((today / expected) * 100).toFixed() : 0;
  };

  const groupedWatchlist =
    watchlist.length &&
    watchlist.reduce((acc, curr) => {
      if (!acc[curr.WatchListName]) {
        acc[curr.WatchListName] = [];
      }
      acc[curr.WatchListName].push(curr);
      return acc;
    }, {});

  return (
    <Box>
      <Box
        sx={{
          padding: ' 0.5rem  0.8rem ',
          backgroundColor: '#D6EEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '8vh',
        }}
      >
        <Typography variant="h6">
          {constraints.DATATABLE.ATTENDANCE_COUNT} {totalTodaysCount} / {totalExpectedCount}{' '}
          {constraints.DATATABLE.AS_ON} {selectedFormatedWatchListDate}
        </Typography>
        <Box className="datePicker">
          <DateComponent
            value={selectedWatchListDate}
            onchange={(e) => handleSelectedWatchListDate(e)}
          />
        </Box>
      </Box>
      <Box style={{ padding: '0.5vh 0.5vw 0 0.5vw' }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <TableContainer component={Paper} sx={{ maxHeight: '76.5vh', overflow: 'none' }} ś>
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
                        active={sortOrder.column == 'ReportedCount'}
                        direction={sortOrder.column == 'ReportedCount' ? sortOrder.direction : 'asc'}
                        onClick={() => handleSort('ReportedCount')}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {constraints.DATATABLE.REPORTED_COUNT}
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                    <TableSortLabel
                        active={sortOrder.column === 'AbsentCount'}
                        direction={sortOrder.column === 'AbsentCount' ? sortOrder.direction : 'asc'}
                        onClick={() => handleSort('AbsentCount')}
                      >
                      <Typography variant="body2" fontWeight="bold">
                        {constraints.DATATABLE.ABSENT_COUNT}
                      </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                    <TableSortLabel
                        active={sortOrder.column === 'Achieved'}
                        direction={sortOrder.column === 'Achieved' ? sortOrder.direction : 'asc'}
                        onClick={() => handleSort('Achieved')}
                      >
                      <Typography variant="body2" fontWeight="bold">
                        {constraints.DATATABLE.ACHIVEMENT_PERCENTAGE}
                      </Typography>
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {departmentData &&
                    departmentData.map((department) => (
                      <TableRow key={department.EmpID}>
                        <TableCell>   <Link to= {`/DepartmentDaywiseReport?operationId=${1}&date=${selectedFormatedWatchListDate}&departmentId=${department.DeptID}`} style={{ textDecoration: 'none' }}>{department.DeptName}</Link></TableCell>
                        <TableCell>{department.ExpectedCount}</TableCell>
                        <TableCell>{department.TodaysCount}</TableCell>
                        <TableCell>
                          {parseInt(department.ExpectedCount) - parseInt(department.TodaysCount)}
                        </TableCell>
                        <TableCell>
                          {calculatePercentage(
                            parseInt(department.ExpectedCount),
                            parseInt(department.TodaysCount),
                          )}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
                  {departmentData.length === 0 && departmentDataLoading && (
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
                          <FadeLoader width={3} height={16} color={colors.primaryColor} />
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
                          <Typography variant="body3">
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
                    <TableCell>Total</TableCell>
                    <TableCell>{totalExpectedCount}</TableCell>
                    <TableCell>{totalTodaysCount}</TableCell>
                    <TableCell>
                      {parseInt(totalExpectedCount) - parseInt(totalTodaysCount)}
                    </TableCell>
                    <TableCell>
                      {calculatePercentage(totalExpectedCount, totalTodaysCount)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box id="searchBox">
              <Paper sx={{ padding: '0.8rem'}}>
                <Grid item xs={12} sm={12}>
                  <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Box display={'flex'} flexGrow={1}>
                      <Autocomplete
                        fullWidth
                        value={query}
                        onChange={(event, value) => setQuery(value || '')}
                        inputValue={query}
                        onInputChange={(event, newInputValue) => {
                          setQuery(newInputValue || '');
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
                    </Box>

                    <Box display={'flex'} gap={'0.8rem'} alignItems={'center'}>
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
                  </Box>
                </Grid>
              </Paper>
            </Box>
            <Box mt={1.5} sx={{ overflow: 'auto', maxHeight: '64.5vh' }}>
              <Box >
                {selectedItem ? (
                  <Card
                    variant="outlined"
                    sx={{
                      boxShadow: 2,
                      bgcolor: selectedItem.SwipeDateTime === 'ABSENT' ? '#f43636d4' : '#90EE90',
                    }}
                  >
                    <CardContent sx={{  }}>
                      {/* <Typography variant="h6">Search Result</Typography> */}
                      <Grid container spacing={2}>
                        {/* User Info Section */}
                        <Grid item xs={12} md={5}>
                          <Typography variant="body2" fontWeight={'bold'} mb={1}>User Information</Typography>
                          <Box display="flex" alignItems="center" marginBottom={1}>
                            {selectedItem.EmpGender === 'Male' ? (
                              <BiMale size={28} sx={{ backgroundColor: '#3658f4d4' }} />
                            ) : (
                              <BiFemale size={26} sx={{ backgroundColor: '#d6338f' }} />
                            )}
                            <Typography variant='body3'>
                              {selectedItem.EmpName} ({selectedItem.EmpID})
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" marginBottom={1}>
                            <GoMail size={20} sx={{ backgroundColor: '#d6338f' }} />
                            <Typography variant='body3'>
                              &nbsp;
                              <a href={`mailto:${selectedItem.EmpEmail}`} target="_blank">
                                {selectedItem.EmpEmail}
                              </a>
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" marginBottom={1}>
                            <VscOrganization size={20} sx={{ backgroundColor: '#d6338f' }} />
                            <Typography variant='body3'>&nbsp;{selectedItem.DeptName}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" marginBottom={1}>
                            <PiMicrosoftTeamsLogoFill
                              size={20}
                              sx={{ backgroundColor: '#d6338f' }}
                            />
                            <Typography variant='body3'>
                              &nbsp;
                              <a
                                href={`https://teams.microsoft.com/l/chat/0/0?users=${selectedItem.EmpEmail}`}
                                target="_blank"
                              >
                                Chat
                              </a>
                            </Typography>
                            <Typography>
                              {selectedItem.Location}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Swipe Info Section */}
                        <Grid item xs={12} md={7}>
                          <Typography variant="body2" fontWeight={'bold'} mb={1}>Swipe Information</Typography>
                          {selectedItem.SwipeDateTime === 'ABSENT' ? (
                            <Typography variant='body3' sx={{ color: 'red' }}>ABSENT</Typography>
                          ) : (
                            <Table>
                              <TableBody>
                                {selectedItemAllEntries.map((item, index) => (
                                  <TableRow key={index} >
                                    <TableCell sx={{border:'none'}}>
                                      {item.SwipeDateTime} - {item.InOut} - {item.FloorDoorName}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Typography variant='body3' color="red">
                      {error}
                    </Typography>
                    {fetchHistoryError && (
                      <Typography variant='body3' color="error">
                        {fetchHistoryError}
                      </Typography>
                    )}
                  </>
                )}
                {selectedItem?.length === 0 && employeeDetailsLoading && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      minHeight: '20vh',
                      alignItems: 'center',
                      // background: "red",
                    }}
                  >
                    <FadeLoader width={3} height={16} color={colors.primaryColor} />
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
                        {Object.entries(groupedWatchlist).map(
                          ([watchlistName, employees], index) => (
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
                          ),
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Box>
    </Box>
  );
}

export default Datatable;
