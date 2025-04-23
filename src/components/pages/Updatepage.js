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
  (error) => Promise.reject(error)
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

  // Fetch initial data
  useEffect(() => {
    axios.get(`${url}/deptsubdept`).then((res) => setDepts(res.data)).catch(console.error);
    axios.get(`${url}/deptmanager`).then((res) => {
      const sorted = [...res.data].sort((a, b) =>
        (a.DeptName || '').localeCompare(b.DeptName || '', undefined, { sensitivity: 'base' })
      );
      setMappings(sorted);
    }).catch(console.error);
  }, []);

  // Filter sub-departments based on selected department
  useEffect(() => {
    const subs = depts
      .filter((d) => d.DeptId === deptId)
      .map((d) => ({ id: d.SubDeptId, name: d.SubDeptName }));
    setSubDepts(subs);
    if (!editMode) setSubDeptId(''); // Only reset in add mode
  }, [deptId, depts]);

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
      empname: mapping.ManagerName, // Assumes ManagerName is returned by /deptmanager
      email: mapping.ManagerEmail,
    };
    setSelectedEmployee(tempEmployee);
    setManager({ name: tempEmployee.empname, email: tempEmployee.email });
    setSearchTerm(tempEmployee.empname);
    setEmployees([tempEmployee]); // Pre-populate options with current manager
  };

  // Handle delete button click
  const handleDelete = (deptId, subDeptId) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      axios
        .delete(`${url}/deptmanager/${deptId}/${subDeptId}`)
        .then(() => axios.get(`${url}/deptmanager`))
        .then((res) => {
          const sorted = [...res.data].sort((a, b) =>
            (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' })
          );
          setMappings(sorted);
          alert('Mapping deleted');
        })
        .catch((err) => {
          console.error('Error deleting mapping:', err);
          alert('Failed to delete mapping');
        });
    }
  };

  // Submit (add or update)
  const handleSubmit = () => {
    if (!deptId || !subDeptId || !selectedEmployee) {
      alert('Please complete all fields');
      return;
    }

    const { EmpId: ManagerId, email: ManagerEmail } = selectedEmployee;
    const { DeptName, SubDeptName } = depts.find((d) => d.DeptId === deptId && d.SubDeptId === subDeptId) || {};

    if (editMode) {
      // If deptId or subDeptId changed, delete old mapping and create new one
      if (editingMapping.DeptId !== deptId || editingMapping.SubDeptId !== subDeptId) {
        axios
          .delete(`${url}/deptmanager/${editingMapping.DeptId}/${editingMapping.SubDeptId}`)
          .then(() =>
            axios.post(`${url}/deptmanager`, {
              DeptId: deptId,
              DeptName,
              SubDeptId: subDeptId,
              SubDeptName,
              ManagerId,
              ManagerEmail,
            })
          )
          .then(() => axios.get(`${url}/deptmanager`))
          .then((res) => {
            const sorted = [...res.data].sort((a, b) =>
              (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' })
            );
            setMappings(sorted);
            alert('Mapping updated');
            resetForm();
          })
          .catch((err) => {
            console.error('Error updating mapping:', err);
            alert('Failed to update mapping');
          });
      } else {
        // Simple update if deptId and subDeptId are unchanged
        axios
          .put(`${url}/deptmanager/${deptId}/${subDeptId}`, { ManagerId, ManagerEmail })
          .then(() => axios.get(`${url}/deptmanager`))
          .then((res) => {
            const sorted = [...res.data].sort((a, b) =>
              (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' })
            );
            setMappings(sorted);
            alert('Mapping updated');
            resetForm();
          })
          .catch((err) => {
            console.error('Error updating mapping:', err);
            alert('Failed to update mapping');
          });
      }
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
            (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' })
          );
          setMappings(sorted);
          alert('Mapping added');
          resetForm();
        })
        .catch((err) => {
          console.error('Error adding mapping:', err);
          alert('Failed to add mapping');
        });
    }
  };

  // Reset form to initial state
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

  // Toggle sort direction
  const handleSort = () => {
    const dir = sortDir === 'asc' ? 'desc' : 'asc';
    const sorted = [...mappings].sort((a, b) =>
      (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' })
    );
    if (dir === 'desc') sorted.reverse();
    setMappings(sorted);
    setSortDir(dir);
  };

  return (
    <Box sx={{ p: 2, background: '#f9f9f9', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Dashboard */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader title={<Typography variant="h6">Existing Mappings</Typography>} />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{ maxHeight: 450, overflowY: 'auto' }} component={Paper}>
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
                            onClick={() => handleDelete(m.DeptId, m.SubDeptId)}
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
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader
              title={<Typography variant="h6">{editMode ? 'Update Mapping' : 'Add New Mapping'}</Typography>}
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
                    // Removed disabled={editMode} to allow editing
                  >
                    {Array.from(new Set(depts.map((d) => d.DeptId))).map((id) => (
                      <MenuItem key={id} value={id}>{depts.find((d) => d.DeptId === id).DeptName}</MenuItem>
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
                    disabled={!deptId} // Only disabled if no dept selected
                  >
                    {subDepts.map((sd) => (
                      <MenuItem key={sd.id} value={sd.id}>{sd.name}</MenuItem>
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
                renderInput={(params) => <TextField {...params} label="Search Manager" size="small" />}
                noOptionsText="No matches"
                sx={{ mb: 2 }}
              />

              {selectedEmployee && (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={editMode ? 4 : 8}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      value={manager.email}
                      InputProps={{ readOnly: true }} // Email is still read-only, derived from manager
                    />
                  </Grid>
                  <Grid item xs={editMode ? 4 : 4}>
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