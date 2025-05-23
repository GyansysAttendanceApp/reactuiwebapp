import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import FadeLoader from 'react-spinners/FadeLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import dayjs from 'dayjs';
import {
  formatDateWithoutTime,
  formatDateWithTime,
  weekdaysTypeAccordingToDate,
} from '../../utils/Helper';
import * as XLSX from 'xlsx'; // For Excel/CSV export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For PDF table

const DepartmentDayWiseReport = () => {
  const [departmentDayWiseData, setDepartmentDayWiseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { selectedFormatedWatchListDate } = useContext(UserContext);
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const operationId = queryParams.get('operationId');
  const departmentId = queryParams.get('departmentId');
  const date = queryParams.get('date');
  const deptName = queryParams.get('deptName');
  const subDeptId = queryParams.get('subDeptId');
  const subDeptName = queryParams.get('subDeptName');

  useEffect(() => {
    const fetchDepartmentdata = async () => {
      setLoading(true);
      try {
        const apiUrl = subDeptId
          ? `${url}/get-employee-attendance/${operationId}/${date}/${departmentId}/${subDeptId}`
          : `${url}/get-employee-attendance/${operationId}/${date}/${departmentId}/null`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('apiToken')}`,
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());

        if (response) {
          setDepartmentDayWiseData(response);
        } else {
          setDepartmentDayWiseData([]);
        }
      } catch (error) {
        console.error('Error fetching department data', error);
        setDepartmentDayWiseData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartmentdata();
  }, [operationId, date, departmentId, subDeptId]);

  const handleBack = async () => {
    await navigate('/');
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(departmentDayWiseData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Department Data');
    XLSX.writeFile(workbook, 'DepartmentDayWiseReport.xlsx');
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
          <Box display="flex" justifyContent="flex-end" gap="1rem">
            <Button variant="contained" color="success" onClick={exportToExcel}>
              Export to Excel
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <FadeLoader color="#1976d2" />
          </Box>
        ) : (
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
                    <TableCell>
                      {weekdaysTypeAccordingToDate(row.IsWeekDay, row.IsHoliday)}
                    </TableCell>
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
        )}
      </div>
    </>
  );
};

export default DepartmentDayWiseReport;
