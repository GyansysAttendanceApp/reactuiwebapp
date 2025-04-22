// import React, { useState, useContext, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Table from '@mui/material/Table';
// import Tooltip from '@mui/material/Tooltip';
// import TableHead from '@mui/material/TableHead';
// import TableBody from '@mui/material/TableBody';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { FcOk } from 'react-icons/fc';
// import { FcHighPriority } from 'react-icons/fc';
// import UserContext from '../../context/UserContext';
// import { useLocation } from 'react-router-dom';
// import dayjs from 'dayjs';
// import {
//   formatDateWithoutTime,
//   formatDateWithTime,
//   weekdaysTypeAccordingToDate,
// } from '../../utils/Helper';
// import { Tab } from '@mui/material';

// const DepartmentDayWiseReport = () => {
//   const [departmentDayWiseData, setDepartmentDayWiseData] = useState([]);
//   const location = useLocation();

//   const { selectedFormatedWatchListDate } = useContext(UserContext);
//   const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const operationId = queryParams.get('operationId');
//   const departmentId = queryParams.get('departmentId');
//   const date = queryParams.get('date');
//   const DeptName = queryParams.get('deptName');

//   useEffect(() => {
//     const fetchDepartmentdata = async () => {
//       try {
//         const response = await fetch(
//           `${url}/get-employee-attendance/${operationId}/${date}/${departmentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('apiToken')}`, // Add Authorization header
//               'Content-Type': 'application/json', // Optional: Specify content type
//             },
//           },
//         ).then((res) => res.json());

//         console.log({ response }, 'response from departmentwise data');
//         if (response) {
//           setDepartmentDayWiseData(response);
//         }

//         // const response = await fetch(
//         //   `${url}/get-employee-attendance/${operationId}/${date}/${departmentId}`,
//         // ).then((res) => res.json());
//         // console.log({ response }, 'response from departmentwise data');
//         // if (response) {
//         //   setDepartmentDayWiseData(response);
//         // }
//       } catch (error) {
//         console.log('Error fetching departmrntdata', error);
//         setDepartmentDayWiseData([]);
//       }
//     };
//     fetchDepartmentdata();
//   }, []);

//   const handleBack = async () => {
//     // await setActiveApiCall(false);
//     await navigate('/');
//   };
//   return (
//     <>
//       <div>
//         <Box
//           bgcolor="#d9d8d8"
//           borderBottom="1px solid #ccc"
//           padding="0.5rem"
//           //   px="10px"
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           position="sticky"
//           top="0"
//           zIndex="100"
//         >
//           <Box display="flex" justifyContent="space-between" alignItems="center" gap="1rem">
//             <Button variant="contained" color="primary" onClick={handleBack}>
//               Back to home page
//             </Button>

//             <Typography variant="h6" fontWeight="bold">
//               Attendance History of Department: {DeptName}
//             </Typography>
//           </Box>

//           <Box
//             padding="0.7rem 0"
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             position="sticky"
//             top="0px"
//             zIndex="100"
//             // gap="16px"
//           >
//             <Box display={'flex'} alignItems={'center'} gap={'1rem'}>
//               {/* <Box width={'11vw'}>
//                 <DateComponent
//                   views={['month', 'year']}
//                   value={dayjs(new Date())}
//                   onchange={() => {}}
//                   // style={{width:'9vw'}}
//                 />
//               </Box> */}
//               <Box>
//                 {/* <TextField
//                   id="year-month-picker"
//                   type="month"
//                 //   value={selectedYearMonth}
//                 //   onChange={handleYearMonthChange}
//                   InputLabelProps={{
//                     shrink: true,
//                   }} */}
//                 {/* size="small"
//                   style={{
//                     minWidth: '150px',
//                     backgroundColor: 'white',
//                     borderRadius: '4px',
//                     height: '1.4375em;',
//                   }}
//                 /> */}
//               </Box>

//               <Box>
//                 {/* <TextField
//                   placeholder="Search by Employee name"
//                 //   value={searchQuery}
//                 //   onChange={handleSearchInputChange}
//                   variant="outlined"
//                   size="small"
//                   style={{
//                     width: '300px',
//                   }}
//                 /> */}
//               </Box>

//               {/* <Button variant="contained" >
//                 Search
//               </Button> */}
//             </Box>
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             overflowX: 'auto',
//             height: '75vh',
//           }}
//         >
//           <Table>
//             <TableHead
//             // sx={{ position: 'sticky', top: 0, background: 'white' }}
//             >
//               <TableRow>
//                 <TableCell>No.</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Day</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Department</TableCell>
//                 <TableCell>Emp ID</TableCell>
//                 <TableCell>Emp Name</TableCell>
//                 <TableCell>First In</TableCell>
//                 <TableCell>Last Out</TableCell>
//                 <TableCell>Duration</TableCell>
//                 <TableCell>Remarks</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody sx={{}}>
//               {departmentDayWiseData.map((row, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{formatDateWithoutTime(row.AttDate)}</TableCell>
//                   <TableCell>{row.AttDay}</TableCell>
//                   <TableCell>{weekdaysTypeAccordingToDate(row.IsWeekDay, row.IsHoliday)}</TableCell>
//                   <TableCell>{row.DeptName}</TableCell>
//                   <TableCell>{row.EmpID}</TableCell>
//                   <TableCell>{row.EmpName}</TableCell>
//                   <TableCell>{formatDateWithTime(row.FirstIn)}</TableCell>
//                   <TableCell>{formatDateWithTime(row.LastOut)}</TableCell>
//                   <TableCell>{row.Duration}</TableCell>
//                   <TableCell>{row.HolidayText}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>
//       </div>
//     </>
//   );
// };

// export default DepartmentDayWiseReport;

import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import dayjs from 'dayjs';
import {
  formatDateWithoutTime,
  formatDateWithTime,
  weekdaysTypeAccordingToDate,
} from '../../utils/Helper';

const DepartmentDayWiseReport = () => {
  const [departmentDayWiseData, setDepartmentDayWiseData] = useState([]);
  const location = useLocation();
  const { selectedFormatedWatchListDate } = useContext(UserContext);
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const operationId = queryParams.get('operationId');
  const departmentId = queryParams.get('departmentId');
  const date = queryParams.get('date');
  const deptName = queryParams.get('deptName');
  const subDeptId = queryParams.get('subDeptId'); // Extract subDeptId
  const subDeptName = queryParams.get('subDeptName'); // Extract subDeptName for display

  useEffect(() => {
    const fetchDepartmentdata = async () => {
      try {
        // Construct the URL with subDeptId if provided, otherwise omit it
        const apiUrl = subDeptId
          ? `${url}/get-employee-attendance/${operationId}/${date}/${departmentId}/${subDeptId}`
          : `${url}/get-employee-attendance/${operationId}/${date}/${departmentId}/null`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('apiToken')}`,
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());

        console.log({ response }, 'response from departmentwise data');
        if (response) {
          setDepartmentDayWiseData(response);
        } else {
          setDepartmentDayWiseData([]);
        }
      } catch (error) {
        console.log('Error fetching department data', error);
        setDepartmentDayWiseData([]);
      }
    };
    fetchDepartmentdata();
  }, [operationId, date, departmentId, subDeptId]);

  const handleBack = async () => {
    await navigate('/');
  };

  return (
    <>
      <div>
        <Box
          bgcolor="#d9d8d8"
          borderBottom="1px solid #ccc"
          padding="0.5rem"
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
              Attendance History of {subDeptName ? `${subDeptName} (${deptName})` : deptName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ overflowX: 'auto', height: '75vh' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Dept</TableCell>
                <TableCell>SubDept</TableCell>
                <TableCell>Emp ID</TableCell>
                <TableCell>Emp Name</TableCell>
                <TableCell>First In</TableCell>
                <TableCell>Last Out</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departmentDayWiseData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDateWithoutTime(row.AttDate)}</TableCell>
                  <TableCell>{row.AttDay}</TableCell>
                  <TableCell>{weekdaysTypeAccordingToDate(row.IsWeekDay, row.IsHoliday)}</TableCell>
                  <TableCell>{row.DeptName}</TableCell>
                  <TableCell>{row.SubDeptName || '-'}</TableCell>
                  <TableCell>{row.EmpID}</TableCell>
                  <TableCell>{row.EmpName}</TableCell>
                  <TableCell>{formatDateWithTime(row.FirstIn)}</TableCell>
                  <TableCell>{formatDateWithTime(row.LastOut)}</TableCell>
                  <TableCell>{row.Duration}</TableCell>
                  <TableCell>{row.HolidayText}</TableCell>
                </TableRow>
              ))}
              {departmentDayWiseData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Typography>No data available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </div>
    </>
  );
};

export default DepartmentDayWiseReport;
