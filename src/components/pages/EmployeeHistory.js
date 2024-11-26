import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import Footer from '../common/Footer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import Tooltip from '@mui/material/Tooltip'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { FcOk } from 'react-icons/fc'
import { FcHighPriority } from 'react-icons/fc'
import { useMsal } from '@azure/msal-react'

function EmployeeHistory() {
  const { empId, year, month } = useParams()
  const [employeeData, setEmployeeData] = useState([])
  const [selectedYearMonth, setSelectedYearMonth] = useState(`${year}-${month}`)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployeeHistory = async () => {
      try {
        const response = await axios.get(`${url}/attendance/${empId}/${year}/${month}`)
        setEmployeeData(response.data)
      } catch (error) {
        console.error('Error fetching employee history:', error)
      }
    }

    fetchEmployeeHistory()
  }, [empId, year, month])

  const handleYearMonthChange = (event) => {
    const selectedMonth = event.target.value
    setSelectedYearMonth(selectedMonth)
    const [selectedYear, selectedMonthValue] = selectedMonth.split('-')
    navigate(`/EmpHistory/${empId}/${selectedYear}/${selectedMonthValue}`)
  }

  const handleSearchInputChange = async (event) => {
    const query = event.target.value
    setSearchQuery(query)
    try {
      if (query.trim() === '') {
        setSuggestions([])
        return
      }
      const response = await axios.get(`${url}/employees?name=${query}`)
      setSuggestions(response.data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handleSuggestionClick = (employee) => {
    setSearchQuery(employee.EmpName)
    setSuggestions([])
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${url}/employees?name=${searchQuery}`)
      const data = response.data
      if (data.length > 0) {
        const empId = data[0].EmpID
        navigate(`/EmpHistory/${empId}/${year}/${month}`)
      } else {
        console.log('Employee not found')
      }
    } catch (error) {
      console.error('Error fetching employee:', error)
    }
  }

  // sorting as per thr duration need to be done
  // const handleSort = (key) => {
  //   setSortConfig((prev) => ({
  //     key,
  //     direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
  //   }));
  // };

  // const sortedData = [...employeeData].sort((a, b) => {
  //   const { key, direction } = sortConfig;
  //   const valueA = key === 'Duration' ? parseDuration(a[key]) : a[key];
  //   const valueB = key === 'Duration' ? parseDuration(b[key]) : b[key];

  //   if (valueA < valueB) return direction === 'asc' ? -1 : 1;
  //   if (valueA > valueB) return direction === 'asc' ? 1 : -1;
  //   return 0;
  // });

  return (
    <>
      <div>
        <Box
          bgcolor="#d9d8d8"
          borderBottom="1px solid #ccc"
          py="0px"
          px="10px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          position="sticky"
          top="0"
          zIndex="100"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" gap="1rem">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                Back to home page
              </Button>
            </Link>

            <Typography variant="h6" fontWeight="bold">
              Attendance History of Employee ID: {empId}
            </Typography>
          </Box>

          <Box
            padding="0.7rem 0"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="sticky"
            top="0px"
            zIndex="100"
            gap="16px"
          >
            <TextField
              id="year-month-picker"
              type="month"
              value={selectedYearMonth}
              onChange={handleYearMonthChange}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              style={{ minWidth: '150px', backgroundColor: 'white' }}
            />
            <Box>
              <TextField
                // label="Search by Employee name"
                value={searchQuery}
                onChange={handleSearchInputChange}
                variant="outlined"
                size="small"
                style={{
                  marginRight: '8px',
                  width: '300px',
                  backgroundColor: 'white',
                }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
              {/* </Box> */}
              {suggestions.length > 0 && (
                <Box
                  style={{
                    position: 'absolute',
                    backgroundColor: '#fff',
                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
                    borderRadius: '5px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    width: '300px',
                  }}
                >
                  {suggestions.map((employee) => (
                    <Button
                      key={employee.EmpID}
                      fullWidth
                      onClick={() => handleSuggestionClick(employee)}
                      style={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                      }}
                    >
                      {employee.EmpName}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            overflowX: 'auto',
            height: '75vh',
          }}
        >
          <Table>
            <TableHead sx={{ position: 'sticky', top: 0, background: 'white' }}>
              <TableRow>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Day</b>
                </TableCell>
                <TableCell>
                  <b>Type</b>
                </TableCell>
                <TableCell>
                  <b>Emp Name</b>
                </TableCell>
                <TableCell>
                  <b>Department</b>
                </TableCell>
                <TableCell>
                  <b>First In</b>
                </TableCell>
                <TableCell>
                  <b>Last Out</b>
                </TableCell>
                <TableCell>
                  <b>Duration</b>
                </TableCell>
                <TableCell>
                  <b>Remarks</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{}}>
              {employeeData.map((employee) => (
                <TableRow
                  key={employee.Date}
                  style={{
                    backgroundColor: employee.IsHoliday ? '#8abec2' : '',
                  }}
                >
                  <TableCell>{employee.AttDateText}</TableCell>
                  <TableCell>{employee.AttDay}</TableCell>
                  <TableCell>
                    {employee.IsWeekDay ? (employee.IsHoliday ? 'Holiday' : 'Workday') : 'Weekend'}
                  </TableCell>
                  <TableCell>{employee.EmpName}</TableCell>
                  <TableCell>{employee.DeptName}</TableCell>
                  <TableCell>{employee.FirstIn}</TableCell>
                  <TableCell>{employee.LastOut}</TableCell>
                  <TableCell>{employee.Duration}</TableCell>
                  <TableCell>
                    {employee.IsHoliday ? (
                      employee.HolidayText
                    ) : (
                      <Tooltip
                        title={employee.FirstIn ? 'Present' : 'Absent'}
                        arrow
                        placement="top"
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {employee.FirstIn ? (
                            <>
                              <FcOk />
                              <span style={{ marginLeft: '5px' }}></span>
                            </>
                          ) : (
                            <>
                              <FcHighPriority />
                              <span style={{ marginLeft: '5px' }}></span>
                            </>
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </div>
    </>
  )
}

export default EmployeeHistory
