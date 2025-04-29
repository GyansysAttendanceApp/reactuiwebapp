import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import DynamicTable from '../common/DynamicTable';
import { generateMonthDates } from '../../utils/Helper';
import { TextField } from '@mui/material';
import AutoCompleteInput from '../common/AutoCompleteInput';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import * as XLSX from 'xlsx';

const DepartmentMonthWiseReport = () => {
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`;

  const [departmentMonthWiseData, setDepartmentMonthWiseData] = useState([]);
  const [columnDefinition, setColumnDefinition] = useState([]);
  const [departmentSuggestion, setDepartmentSuggestion] = useState([]);
  const [queryFlag, setQueryFlag] = useState(false);
  const [query, setQuery] = useState('');
  const [DeptName, setDepatName] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const operationId = 2;
  const { deptId, year, month, subDeptId, empName } = useParams();
  console.log({ deptId, year, month, subDeptId, empName });
  const convertJson = {};
  const [selectedYearMonth, setSelectedYearMonth] = useState(`${year}-${month}`);

  console.log(selectedYearMonth);
  useEffect(() => {
    const fetchDepartmentdata = async () => {
      try {
        await fetch(
          `${url}/monthly-attendance?operationId=${operationId}&deptId=${deptId}&year=${year}&month=${month}${subDeptId ? `&subDeptId=${subDeptId}` : ''}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('apiToken')}`,
            },
          },
        )
          .then((res) => res.json())
          .then((response) => {
            response?.forEach((item) => {
              if (convertJson[item.EmpName]) {
                convertJson[item.EmpName]['EmpName'] = item.EmpName;
                convertJson[item.EmpName]['EmpId'] = item.EmpId;
                convertJson[item.EmpName]['DeptName'] = item.DeptName;
                convertJson[item.EmpName]['SubDeptName'] = item.SubDeptName; // Add SubDeptName
                if (item.Duration) {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>{item.Duration}</span>
                  );
                } else if (!item.IsWeekDay) {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'dark-blue', fontWeight: 'bold' }}> WE </span>
                  );
                } else if (item.IsHoliday) {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'orange', fontWeight: 'bold' }}> H</span>
                  );
                } else {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>-</span>
                  );
                }
              } else {
                convertJson[item.EmpName] = {};
                convertJson[item.EmpName]['EmpName'] = item.EmpName;
                convertJson[item.EmpName]['EmpId'] = item.EmpId;
                convertJson[item.EmpName]['DeptName'] = item.DeptName;
                convertJson[item.EmpName]['SubDeptName'] = item.SubDeptName; // Add SubDeptName
                if (item.Duration) {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>{item.Duration}</span>
                  );
                } else if (!item.IsWeekDay) {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'blue', fontWeight: 'bold' }}> WE </span>
                  );
                } else if (item.IsHoliday) {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'orange', fontWeight: 'bold' }}> H</span>
                  );
                } else {
                  convertJson[item.EmpName][dayjs(item.AttDateText).format('DD/MM')] = (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>-</span>
                  );
                }
              }
            });

            console.log(Object.values(convertJson));
            const monthDates = generateMonthDates(year, month);
            setDepartmentMonthWiseData(Object.values(convertJson));
            const columnSet = new Set([
              ...Object.keys(Object.values(convertJson)[0]),
              ...monthDates,
            ]);
            const column = Array.from(columnSet);
            console.log({ column });

            setColumnDefinition(column.map((item) => ({ id: item, label: item })));
          })
          .catch((error) => {
            console.error('Error fetching employee attendance:', error);
          });
      } catch (error) {
        console.log('Error fetching department data', error);
        setDepartmentMonthWiseData([]);
      }
    };
    fetchDepartmentdata();
  }, [month, year, queryFlag]);

  useEffect(() => {
    fetchDepartmentSuggestion(dayjs(new Date()).format('YYYY-MM-DD'));
  }, []);

  const fetchDepartmentSuggestion = async (date) => {
    try {
      const response = await axios.get(`${url}/dept?date=${date}`);
      console.log('dataTable', response);
      setDepartmentSuggestion(response.data);
      const deptDetails = response.data.filter((item) => item.DeptID === deptId);
      if (deptDetails) {
        setDepatName(departmentMonthWiseData[0]?.DeptName);
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };
  const handleYearMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setDepartmentMonthWiseData([]);
    setSelectedYearMonth(selectedMonth);

    const [selectedYear, selectedMonthValue] = selectedMonth.split('-');
    console.log({ selectedMonth, selectedYear });
    navigate(
      `/DepartmentMonthWiseReport/${operationId}/${deptId}/${selectedYear}/${selectedMonthValue}`,
    );
  };

  const handleSearch = async () => {
    if (!query) {
      return;
    } else {
      setQueryFlag(!queryFlag);
      console.log({ query });

      const deptDetails = departmentSuggestion.filter((item) => item.DeptName === query);

      setDepatName(deptDetails[0].DeptName);
      console.log({ deptDetails });
      const [selectedYear, selectedMonthValue] = selectedYearMonth.split('-');
      setDepartmentMonthWiseData([]);
      navigate(
        `/DepartmentMonthWiseReport/${operationId}/${deptDetails[0].DeptID}/${selectedYear}/${selectedMonthValue}`,
      );
    }
  };
  const handleBack = async () => {
    await navigate('/');
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    if (!departmentMonthWiseData || departmentMonthWiseData.length === 0) {
      alert('No data available to export!');
      return;
    }

    // Prepare data for Excel
    const worksheetData = departmentMonthWiseData.map((row) => {
      const formattedRow = { ...row };
      Object.keys(formattedRow).forEach((key) => {
        if (React.isValidElement(formattedRow[key])) {
          // Extract text content from JSX elements
          formattedRow[key] = formattedRow[key].props.children;
        }
      });
      return formattedRow;
    });

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    // Export the workbook
    XLSX.writeFile(workbook, 'DepartmentMonthWiseReport.xlsx');
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
              Attendance History of Department:{' '}
              {departmentMonthWiseData[0]?.DeptName || 'Loading...'} / Sub Department:{' '}
              {departmentMonthWiseData[0]?.SubDeptName || 'Loading...'}
            </Typography>
          </Box>
          <Box display={'flex'} gap={'1rem'}>
            <TextField
              id="year-month-picker-departmentwise-month-report"
              type="month"
              value={selectedYearMonth}
              onChange={handleYearMonthChange}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
            <Button variant="contained" color="success" onClick={exportToExcel}>
              Export to Excel
            </Button>
            {/* <Box sx={{ width: '24vw' }}>
              <AutoCompleteInput
                isSearch
                query={query}
                setQuery={setQuery}
                suggestions={departmentSuggestion?.map((item) => item?.DeptName)}
                handleSearch={handleSearch}
                label={'Search Department'}
              />
            </Box> */}
          </Box>
        </Box>
        <Box
          sx={{
            overflowX: 'auto',
            height: '75vh',
          }}
        >
          <DynamicTable data={departmentMonthWiseData} columns={columnDefinition} />
        </Box>
      </div>
    </>
  );
};

export default DepartmentMonthWiseReport;
