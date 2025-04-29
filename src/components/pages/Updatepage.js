import React, { useState, useEffect, useMemo } from 'react';
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
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
 
  const showSnackbar = (message, severity = 'success') => {
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
        console.log('Mappings:', sorted);
      })
      .catch(console.error);
  }, []);
 
  // Group mappings by DeptId and SubDeptId
  const groupedMappings = useMemo(() => {
    const groups = {};
    mappings.forEach((m) => {
      const key = `${m.DeptId}-${m.SubDeptId}`;
      if (!groups[key]) {
        groups[key] = {
          DeptId: m.DeptId,
          DeptName: m.DeptName,
          SubDeptId: m.SubDeptId,
          SubDeptName: m.SubDeptName,
          managers: [],
        };
      }
      groups[key].managers.push({ ManagerId: m.ManagerId, ManagerEmail: m.ManagerEmail });
    });
    return Object.values(groups).sort((a, b) => a.DeptName.localeCompare(b.DeptName));
  }, [mappings]);
 
  // Update selectedGroup when groupedMappings changes
  useEffect(() => {
    if (selectedGroup) {
      const updatedGroup = groupedMappings.find(
        (g) => g.DeptId === selectedGroup.DeptId && g.SubDeptId === selectedGroup.SubDeptId,
      );
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
      } else {
        setSelectedGroup(null);
      }
    }
  }, [groupedMappings]);
 
  // Filter sub-departments based on selected department
  useEffect(() => {
    const subs = depts
      .filter((d) => d.DeptId === deptId)
      .map((d) => ({ id: d.SubDeptId, name: d.SubDeptName }));
    setSubDepts(subs);
    setSubDeptId('');
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
 
  // Handle delete manager
  const handleDelete = (deptId, subDeptId, managerId) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      axios
        .delete(`${url}/deptmanager/${deptId}/${subDeptId}/${managerId}`)
        .then(() => axios.get(`${url}/deptmanager`))
        .then((res) => {
          const sorted = [...res.data].sort((a, b) =>
            (a.DeptName || '').localeCompare(b.DeptName || '', { sensitivity: 'base' }),
          );
          setMappings(sorted);
          showSnackbar('Manager deleted', 'success');
        })
        .catch((err) => {
          console.error('Error deleting manager:', err);
          showSnackbar('Failed to delete manager', 'error');
        });
    }
  };
 
  // Handle form submission (add new mapping)
  const handleSubmit = () => {
    if (!deptId || !subDeptId || !selectedEmployee) {
      showSnackbar('Please complete all fields', 'warning');
      return;
    }
 
    const { EmpId: ManagerId, email: ManagerEmail } = selectedEmployee;
    const { DeptName, SubDeptName } =
      depts.find((d) => d.DeptId === deptId && d.SubDeptId === subDeptId) || {};
 
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
        showSnackbar(errorMessage, 'error');
      });
  };
 
  // Reset form
  const resetForm = () => {
    setDeptId('');
    setSubDeptId('');
    setSelectedEmployee(null);
    setManager({ name: '', email: '' });
    setSearchTerm('');
    setEmployees([]);
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
          <Card variant="outlined" sx={{ maxheight: '70vh' }}>
            <CardHeader title={<Typography variant="h6">Existing Mappings</Typography>} />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={{ maxHeight: '75vh', overflowY: 'auto' }} component={Paper}>
                <Table stickyHeader size="small">
                  <TableHead sx={{ background: '#eee', position: 'sticky', top: 0, zIndex: 1 }}>
                    <TableRow>
                      <TableCell>Dept</TableCell>
                      <TableCell>Sub-Dept</TableCell>
                      <TableCell>Number of Managers</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedMappings.map((group, i) => (
                      <TableRow
                        key={i}
                        hover
                        onClick={() => setSelectedGroup(group)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor:
                            selectedGroup &&
                            selectedGroup.DeptId === group.DeptId &&
                            selectedGroup.SubDeptId === group.SubDeptId
                              ? '#e0e0e0'
                              : i % 2 === 0
                                ? '#f5f5f5'
                                : 'white',
                        }}
                      >
                        <TableCell>{group.DeptName}</TableCell>
                        <TableCell>{group.SubDeptName}</TableCell>
                        <TableCell>{group.managers.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
 
        {/* Form and Managers List */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardHeader title={<Typography variant="h6">Add New Mapping</Typography>} />
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
                    label="Sub-Dept"
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
                      Add Mapping
                    </Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
 
          {selectedGroup && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardHeader
                title={`Managers for ${selectedGroup.DeptName} - ${selectedGroup.SubDeptName}`}
              />
              <CardContent sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                <List>
                  {selectedGroup.managers.map((manager, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                      }}
                    >
                      <ListItemText primary={manager.ManagerId} secondary={manager.ManagerEmail} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() =>
                            handleDelete(
                              selectedGroup.DeptId,
                              selectedGroup.SubDeptId,
                              manager.ManagerId,
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}