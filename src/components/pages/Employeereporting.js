import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FadeLoader from 'react-spinners/FadeLoader';

const reportOptions = [ 'Need to Report', 'WFH Approved', 'Remote Employee', 'Partial Reporting', 'Bench'];

export default function EmployeeStatus() {
  const [mapping, setMapping] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [subDeptList, setSubDeptList] = useState([]);
  const [deptId, setDeptId] = useState('');
  const [subDeptId, setSubDeptId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dept-subdept mapping on mount
  useEffect(() => {
    async function fetchMapping() {
      try {
        const res = await axios.get('http://localhost:8085/api/deptsubdeptmapping');
        const data = res.data.map(m => ({
          DeptId: String(m.DeptId),
          DeptName: m.DeptName,
          SubDeptId: String(m.SubDeptId),
          SubDeptName: m.SubDeptName
        }));
        setMapping(data);
        const deptMap = new Map();
        data.forEach(m => deptMap.set(m.DeptId, m.DeptName));
        setDeptList(
          Array.from(deptMap.entries()).map(([id, name]) => ({ DeptId: id, DeptName: name }))
        );
      } catch (err) {
        console.error('Error loading mapping:', err);
        setError('Failed to load departments');
      }
    }
    fetchMapping();
  }, []);

  // Update subDeptList when dept changes
  useEffect(() => {
    if (!deptId) {
      setSubDeptList([]);
      setSubDeptId('');
      return;
    }
    const subMap = new Map();
    mapping
      .filter(m => m.DeptId === deptId)
      .forEach(m => subMap.set(m.SubDeptId, m.SubDeptName));
    setSubDeptList(
      Array.from(subMap.entries()).map(([id, name]) => ({ SubDeptId: id, SubDeptName: name }))
    );
    setSubDeptId('');
  }, [mapping, deptId]);

  // Fetch employees on Search button click
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { deptid: deptId, subdeptid: subDeptId };
      const res = await axios.get('http://localhost:8085/api/employeereport', { params });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employee list');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating report
  const handleReportChange = async (empid, newReport) => {
    try {
      const res = await axios.post(
        `http://localhost:8085/api/employeereport/${empid}/report`,
        { report: newReport }
      );
      setEmployees(prev =>
        prev.map(e => (e.Empid === empid ? { ...e, Report: res.data.Report } : e))
      );
    } catch (err) {
      console.error('Error updating report:', err);
      setError('Failed to update report');
    }
  };

  return (
    <Box sx={{ padding: '0.5vh 0.5vw' }}>
      {error && (
        <Typography color="error" sx={{ marginBottom: '1rem' }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ padding: '0.8rem', marginBottom: '1rem' }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="dept-label">Department</InputLabel>
              <Select
                labelId="dept-label"
                value={deptId}
                label="Department"
                onChange={e => setDeptId(e.target.value)}
              >
                <MenuItem value="">Select Department</MenuItem>
                {deptList.map(d => (
                  <MenuItem key={d.DeptId} value={d.DeptId}>
                    {d.DeptName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={!deptId}>
              <InputLabel id="subdept-label">Sub-Department</InputLabel>
              <Select
                labelId="subdept-label"
                value={subDeptId}
                label="Sub-Department"
                onChange={e => setSubDeptId(e.target.value)}
              >
                <MenuItem value="">Select Sub-dept</MenuItem>
                {subDeptList.map(sd => (
                  <MenuItem key={sd.SubDeptId} value={sd.SubDeptId}>
                    {sd.SubDeptName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchEmployees}
              disabled={!deptId || !subDeptId || loading}
              fullWidth
            >
              {loading ? 'Loading...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <FadeLoader color="#1976d2" />
        </Box>
      )}

      {employees.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: '76.5vh', overflow: 'auto' }}>
          <Table>
            <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
              <TableRow>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    EmpID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Dept
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Subdept
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    Report Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.Empid}>
                  <TableCell>{emp.Empid}</TableCell>
                  <TableCell>{emp.Name}</TableCell>
                  <TableCell>{emp.Email}</TableCell>
                  <TableCell>{emp.Deptid}</TableCell>
                  <TableCell>{emp.Subdeptid}</TableCell>
                  <TableCell>
                    <Select
                      value={emp.Report || ''}
                      onChange={e => handleReportChange(emp.Empid, e.target.value)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="">-- Select Report --</MenuItem>
                      {reportOptions.map(opt => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <Typography variant="body1" sx={{ color: 'gray' }}>
              No employees to display. Select filters and search.
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}