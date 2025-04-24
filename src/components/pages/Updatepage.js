import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import '../../style/Updatepage.css';

const url = process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apiToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default function Updatepage() {
  const [depts, setDepts] = useState([]);
  const [deptId, setDeptId] = useState('');
  const [subDepts, setSubDepts] = useState([]);
  const [subDeptId, setSubDeptId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [manager, setManager] = useState({ name: '', email: '' });
  const [mappings, setMappings] = useState([]);
  const [sortDir, setSortDir] = useState('asc');
  const [editMode, setEditMode] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    console.log('Snackbar Severity:', severity);
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  // Fetch initial data
  useEffect(() => {
    axios
      .get(`${url}/deptsubdept`)
      .then((res) => setDepts(res.data))
      .catch(console.error);
    axios
      .get(`${url}/deptmanager`)
      .then((res) => {
        const sorted = [...res.data].sort((a, b) =>
          (a.DeptName || '').localeCompare(b.DeptName || '', undefined, { sensitivity: 'base' }),
        );
        setMappings(sorted);
      })
      .catch(console.error);
  }, []);

  // Filter sub-departments based on selected department
  useEffect(() => {
    const subs = depts
      .filter((d) => d.DeptId === deptId)
      .map((d) => ({ id: d.SubDeptId, name: d.SubDeptName }));
    setSubDepts(subs);
    if (!editMode) setSubDeptId('');
  }, [deptId, depts, editMode]);

  // Debounce employee search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm.trim()) {
        axios
          .get(`${url}/employeedpt?search=${encodeURIComponent(searchTerm)}`)
          .then((res) => setEmployees(res.data))
          .catch(console.error);
      } else {
        setEmployees([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Handle update button click
  const handleUpdateClick = (mapping) => {
    setEditMode(true);
    setEditingMapping(mapping);
    setDeptId(mapping.DeptId);
    setSubDeptId(mapping.SubDeptId);
    const tempEmployee = {
      EmpId: mapping.ManagerId,
      empname: mapping.ManagerName,
      email: mapping.ManagerEmail,
    };
    setSelectedEmployee(tempEmployee);
    setManager({ name: tempEmployee.empname, email: tempEmployee.email });
    setSearchTerm(tempEmployee.empname);
    setEmployees([tempEmployee]);
  };

  // Handle delete button click
  const handleDelete = (deptId, subDeptId, managerId) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      axios
        .delete(`${url}/deptmanager/${deptId}/${subDeptId}/${managerId}`)
        .then(() => axios.get(`${url}/deptmanager`))
        .then((res) => {
          const sorted = [...res.data].sort((a, b) =>
            (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' }),
          );
          setMappings(sorted);
          showSnackbar('Mapping deleted', 'success');
        })
        .catch((err) => {
          console.error('Error deleting mapping:', err);
          showSnackbar('Failed to delete mapping', 'error');
        });
    }
  };

  // Submit (add or update)
  const handleSubmit = () => {
    if (!deptId || !subDeptId || !selectedEmployee) {
      showSnackbar('Please complete all fields', 'warning');
      return;
    }

    const { EmpId: ManagerId, email: ManagerEmail } = selectedEmployee;
    const { DeptName, SubDeptName } =
      depts.find((d) => d.DeptId === deptId && d.SubDeptId === subDeptId) || {};

    if (editMode) {
      // Simple update: use oldManagerId in URL
      axios
        .put(
          `${url}/deptmanager/${editingMapping.DeptId}/${editingMapping.SubDeptId}/${editingMapping.ManagerId}`,
          { ManagerId, ManagerEmail },
        )
        .then(() => axios.get(`${url}/deptmanager`))
        .then((res) => {
          const sorted = [...res.data].sort((a, b) =>
            (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' }),
          );
          setMappings(sorted);
          showSnackbar('Mapping updated', 'success');
          resetForm();
        })
        .catch((err) => {
          console.error('Error updating mapping:', err);
          showSnackbar('Failed to update mapping', 'error');
        });
    } else {
      // Add new mapping
      axios
        .post(`${url}/deptmanager`, {
          DeptId: deptId,
          DeptName,
          SubDeptId: subDeptId,
          SubDeptName,
          ManagerId,
          ManagerEmail,
        })
        .then(() => axios.get(`${url}/deptmanager`))
        .then((res) => {
          const sorted = [...res.data].sort((a, b) =>
            (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' }),
          );
          setMappings(sorted);
          showSnackbar('Mapping added', 'success');
          resetForm();
        })
        .catch((err) => {
          const errorMessage =
            err.response && err.response.data && err.response.data.error
              ? err.response.data.error
              : 'Failed to add mapping';
          console.error('Error adding mapping:', err);
          console.log('Error message:', errorMessage);
          showSnackbar(errorMessage, 'error');
        });
    }
  };

  // Reset form
  const resetForm = () => {
    setEditMode(false);
    setEditingMapping(null);
    setDeptId('');
    setSubDeptId('');
    setSelectedEmployee(null);
    setManager({ name: '', email: '' });
    setSearchTerm('');
    setEmployees([]);
  };

  // Toggle sort
  const handleSort = () => {
    const dir = sortDir === 'asc' ? 'desc' : 'asc';
    const sorted = [...mappings].sort((a, b) =>
      (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' }),
    );
    if (dir === 'desc') sorted.reverse();
    setMappings(sorted);
    setSortDir(dir);
  };

  return (
    <Box sx={{ p: 2, background: '#f9f9f9', minHeight: '100vh' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={3}>
        {/* Dashboard */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ height: '83vh' }}>
            <CardHeader title={<Typography variant="h6">Existing Mappings</Typography>} />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{ height: '83vh', overflowY: 'auto' }} component={Paper}>
                <Table stickyHeader size="small">
                  <TableHead sx={{ background: '#eee', position: 'sticky', top: 0, zIndex: 1 }}>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel active direction={sortDir} onClick={handleSort}>
                          Dept
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Sub‑Dept</TableCell>
                      <TableCell>Emp ID</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mappings.map((m, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{m.DeptName}</TableCell>
                        <TableCell>{m.SubDeptName}</TableCell>
                        <TableCell>{m.ManagerId}</TableCell>
                        <TableCell>{m.ManagerEmail}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUpdateClick(m)}
                            sx={{ mr: 1 }}
                          >
                            Update
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(m.DeptId, m.SubDeptId, m.ManagerId)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Form */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="h6">
                  {editMode ? 'Update Mapping' : 'Add New Mapping'}
                </Typography>
              }
            />
            <CardContent>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Dept"
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                  >
                    {Array.from(new Set(depts.map((d) => d.DeptId))).map((id) => (
                      <MenuItem key={id} value={id}>
                        {depts.find((d) => d.DeptId === id).DeptName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Sub‑Dept"
                    value={subDeptId}
                    onChange={(e) => setSubDeptId(e.target.value)}
                    disabled={!deptId}
                  >
                    {subDepts.map((sd) => (
                      <MenuItem key={sd.id} value={sd.id}>
                        {sd.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Autocomplete
                options={employees}
                getOptionLabel={(emp) => `${emp.empname} (${emp.EmpId})`}
                inputValue={searchTerm}
                onInputChange={(_, v) => setSearchTerm(v)}
                value={selectedEmployee}
                onChange={(_, option) => {
                  if (option) {
                    setSelectedEmployee(option);
                    setManager({ name: option.empname, email: option.email });
                  } else {
                    setSelectedEmployee(null);
                    setManager({ name: '', email: '' });
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Search Manager" size="small" />
                )}
                noOptionsText="No matches"
                sx={{ mb: 2 }}
              />

              {selectedEmployee && (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      value={manager.email}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button fullWidth variant="contained" onClick={handleSubmit}>
                      {editMode ? 'Update Mapping' : 'Add Mapping'}
                    </Button>
                  </Grid>
                  {editMode && (
                    <Grid item xs={4}>
                      <Button fullWidth variant="outlined" color="secondary" onClick={resetForm}>
                        Cancel
                      </Button>
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
