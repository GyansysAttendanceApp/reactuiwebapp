
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { FcOk } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
import { useMsal } from '@azure/msal-react';

function EmployeeHistory({username}) {
  const { instance, accounts } = useMsal();
  const { empId, year, month } = useParams();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedYearMonth, setSelectedYearMonth] = useState(`${year}-${month}`);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeHistory = async () => {
      try {
        const response = await axios.get(`${url}/attendance/${empId}/${year}/${month}`);
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee history:", error);
      }
    };

    fetchEmployeeHistory();
  }, [empId, year, month]);

  const handleYearMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedYearMonth(selectedMonth);
    const [selectedYear, selectedMonthValue] = selectedMonth.split("-");
    navigate(`/EmpHistory/${empId}/${selectedYear}/${selectedMonthValue}`);
  };

  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    try {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }
      const response = await axios.get(`${url}/employees?name=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (employee) => {
    setSearchQuery(employee.EmpName);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${url}/employees?name=${searchQuery}`);
      const data = response.data;
      if (data.length > 0) {
        const empId = data[0].EmpID;
        navigate(`/EmpHistory/${empId}/${year}/${month}`);
      } else {
        console.log("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  return (
    <>
     {/* <Navbar username={username} /> */}
      <div style={{ minHeight: "calc(100vh - 128px)" }}>
      
        <Box
          bgcolor="#E0E0E0"
          borderBottom="1px solid #ccc"
          py="8px"
          px="16px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          position="sticky"
           top="64px"
           zIndex="100"
        >
          <Box>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                Back to home page
              </Button>
            </Link>
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Attendance History of Employee ID: {empId}
          </Typography>
        </Box>

        <Box
          bgcolor="white"
          borderBottom="1px solid #ccc"
          py="5px"
          px="16px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          position="sticky"
           top="120px"
            zIndex="100"
                    
          
        >
          <TextField
            id="year-month-picker"
            type="month"
            value={selectedYearMonth}
            onChange={handleYearMonthChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box>
            <TextField
              label="Search by Employee name"
              value={searchQuery}
              onChange={handleSearchInputChange}
              variant="outlined"
              style={{ marginRight: "8px", width: "300px" }}
            />
            <Button variant="contained" onClick={handleSearch} sx={{  height: "54px" }}>
              Search
            </Button>
            {suggestions.length > 0 && (
              <Box
                style={{
                  position: "absolute",
                  backgroundColor: "#fff",
                  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
                  borderRadius: "5px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "300px",
                }}
              >
                {suggestions.map((employee) => (
                  <Button
                    key={employee.EmpID}
                    fullWidth
                    onClick={() => handleSuggestionClick(employee)}
                    style={{ justifyContent: "flex-start", textTransform: "none" }}
                  >
                    {employee.EmpName}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{
           overflowX:"auto",
         //  padding: "8px",
       //  maxHeight: "calc(100vh - 128px - 48px)",
        }} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Day</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Emp Name</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>First In</b></TableCell>
                <TableCell><b>Last Out</b></TableCell>
                <TableCell><b>Duration</b></TableCell>
                <TableCell><b>Remarks</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeData.map((employee) => (
                <TableRow
                  key={employee.Date}
                  style={{ backgroundColor: employee.IsHoliday ? "#8abec2" : "" }}
                >
                  <TableCell>{employee.AttDateText}</TableCell>
                  <TableCell>{employee.AttDay}</TableCell>
                  <TableCell>
                    {employee.IsWeekDay
                      ? employee.IsHoliday
                        ? "Holiday"
                        : "Workday"
                      : "Weekend"}
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
                        title={employee.FirstIn ? "Present" : "Absent"}
                        arrow
                        placement="top"
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {employee.FirstIn ? (
                            <>
                              <FcOk />
                              <span style={{ marginLeft: "5px" }}></span>
                            </>
                          ) : (
                            <>
                              <FcHighPriority />
                              <span style={{ marginLeft: "5px" }}></span>
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
      <Footer style={{ position: "fixed", bottom: "0", width: "100%" }} />
    </>
  );
}

export default EmployeeHistory;






























