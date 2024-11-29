import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { NavLink, useNavigate } from 'react-router-dom';
import { FcOk } from 'react-icons/fc';
import { FcHighPriority } from 'react-icons/fc';
import UserContext from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

const DepartmentDayWiseReport = () => {
  const [departmentDayWiseData, setDepartmentDayWiseData] = useState([]);
  const location = useLocation();

  const { selectedFormatedWatchListDate } = useContext(UserContext);
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;
  const navigate = useNavigate();
  const dummyData = [
    {
      date: '2024-11-24',
      day: 'Monday',
      type: 'Office',
      empName: 'John Doe',
      department: 'IT',
      firstIn: '09:00 AM',
      lastOut: '05:00 PM',
      duration: '8h',
      remarks: 'Present',
    },
    {
      date: '2024-11-25',
      day: 'Tuesday',
      type: 'Remote',
      empName: 'Jane Smith',
      department: 'HR',
      firstIn: '08:30 AM',
      lastOut: '04:30 PM',
      duration: '8h',
      remarks: 'Work from home',
    },
    {
      date: '2024-11-26',
      day: 'Wednesday',
      type: 'Leave',
      empName: 'Alice Johnson',
      department: 'Finance',
      firstIn: 'N/A',
      lastOut: 'N/A',
      duration: '0h',
      remarks: 'Sick leave',
    },
  ];

  useEffect(() => {
    const fetchDepartmentdata = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const operationId = queryParams.get('operationId');
        const departmentId = queryParams.get('departmentId');
        const date = queryParams.get('date');

        const response = await fetch(
          `${url}/DepartmentDaywiseReport/${operationId}/${date}/${departmentId}`,
        );
        if (response.data) {
          setDepartmentDayWiseData(response.data);
        }
      } catch (error) {
        console.log('Error fetching departmrntdata', error);
        setDepartmentDayWiseData([]);
      }
    };
    fetchDepartmentdata();
  }, []);

  const handleBack = async () => {
    // await setActiveApiCall(false);
    await navigate('/');
  };
  return (
    <>
      <div>
        <Box
          bgcolor="#d9d8d8"
          borderBottom="1px solid #ccc"
          padding="0.5rem"
          //   px="10px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          position="sticky"
          top="0"
          zIndex="100"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" gap="1rem">
            <Button variant="contained" color="primary" onClick={handleBack}>
              Back to home page
            </Button>

            <Typography variant="h6" fontWeight="bold">
              Attendance History of Employee ID:
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
            // gap="16px"
          >
            <Box display={'flex'} alignItems={'center'} gap={'1rem'}>
              {/* <Box width={'11vw'}>
                <DateComponent
                  views={['month', 'year']}
                  value={dayjs(new Date())}
                  onchange={() => {}}
                  // style={{width:'9vw'}}
                />
              </Box> */}
              <Box>
                {/* <TextField
                  id="year-month-picker"
                  type="month"
                //   value={selectedYearMonth}
                //   onChange={handleYearMonthChange}
                  InputLabelProps={{
                    shrink: true,
                  }} */}
                {/* size="small"
                  style={{
                    minWidth: '150px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    height: '1.4375em;',
                  }}
                /> */}
              </Box>

              <Box>
                {/* <TextField
                  placeholder="Search by Employee name"
                //   value={searchQuery}
                //   onChange={handleSearchInputChange}
                  variant="outlined"
                  size="small"
                  style={{
                    width: '300px',
                  }}
                /> */}
              </Box>

              {/* <Button variant="contained" >
                Search
              </Button> */}
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
              {departmentDayWiseData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.empName}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.firstIn}</TableCell>
                  <TableCell>{row.lastOut}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </div>
    </>
  );
};

export default DepartmentDayWiseReport;
