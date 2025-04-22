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
  Paper
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
  const [empId, setEmpId] = useState('');
  const [manager, setManager] = useState({ name: '', email: '' });
  const [mappings, setMappings] = useState([]);
  const [sortDir, setSortDir] = useState('asc');
//updated
  // fetch data
  useEffect(() => {
    axios.get(`${url}/deptsubdept`).then(res => setDepts(res.data)).catch(console.error);
    axios.get(`${url}/deptmanager`).then(res => {
      const sorted = [...res.data].sort((a,b)=>(a.DeptName||'').localeCompare(b.DeptName||'', undefined, { sensitivity: 'base' }));
      setMappings(sorted);
    }).catch(console.error);
  }, []);

  // filter subs
  useEffect(() => {
    const subs = depts
      .filter(d => d.DeptId === deptId)
      .map(d => ({ id: d.SubDeptId, name: d.SubDeptName }));
    setSubDepts(subs);
    setSubDeptId('');
  }, [deptId, depts]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm.trim()) {
        axios.get(`${url}/employeedpt?search=${encodeURIComponent(searchTerm)}`)
          .then(res => setEmployees(res.data)).catch(console.error);
      } else {
        setEmployees([]); setEmpId(''); setManager({ name:'',email:'' });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // select employee
  const handleEmpSelect = (_, option) => {
    if (option) {
      setEmpId(option.EmpId);
      setManager({ name: option.empname, email: option.email });
    } else {
      setEmpId(''); setManager({ name:'',email:'' });
    }
  };

  // submit
  const handleSubmit = () => {
    if (!deptId || !subDeptId || !empId) {
      alert('Please complete all fields'); return;
    }
    const { DeptName, SubDeptName } = depts.find(d => d.DeptId === deptId && d.SubDeptId === subDeptId);
    axios.post(`${url}/deptmanager`, { DeptId:deptId,DeptName,SubDeptId:subDeptId,SubDeptName,ManagerId:empId,ManagerEmail:manager.email })
      .then(() => axios.get(`${url}/deptmanager`))
      .then(res => {
        const sorted = [...res.data].sort((a,b)=>(a.DeptName||'').localeCompare(b.DeptName||'', undefined, { sensitivity:'base' }));
        setMappings(sorted);
        alert('Mapping added');
      }).catch(console.error);
  };

  // toggle sort direction
  const handleSort = () => {
    const dir = sortDir==='asc'?'desc':'asc';
    const sorted = [...mappings].sort((a,b)=>(a.DeptName||'').localeCompare(b.DeptName||'', undefined, { sensitivity:'base' }));
    if (dir==='desc') sorted.reverse();
    setMappings(sorted);
    setSortDir(dir);
  };

  return (
    <Box sx={{ p:2, background:'#f9f9f9', minHeight:'100vh' }}>
      <Grid container spacing={3}>
        {/* Dashboard */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader title={<Typography variant="h6">Existing Mappings</Typography>} />
            <CardContent sx={{ p:0 }}>
              <TableContainer sx={{ maxHeight: 450, overflowY:'auto' }} component={Paper}>
                <Table stickyHeader size="small">
                  <TableHead sx={{ background:'#eee' }}>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel active direction={sortDir} onClick={handleSort}>
                          Dept
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Sub‑Dept</TableCell>
                      <TableCell>Emp ID</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mappings.map((m,i)=>(
                      <TableRow key={i} hover>
                        <TableCell>{m.DeptName}</TableCell>
                        <TableCell>{m.SubDeptName}</TableCell>
                        <TableCell>{m.ManagerId}</TableCell>
                        <TableCell>{m.ManagerEmail}</TableCell>
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
            <CardHeader title={<Typography variant="h6">Add New Mapping</Typography>} />
            <CardContent>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <TextField select fullWidth size="small" label="Dept" value={deptId} onChange={e=>setDeptId(e.target.value)}>
                    {Array.from(new Set(depts.map(d=>d.DeptId))).map(id=> (
                      <MenuItem key={id} value={id}>{depts.find(d=>d.DeptId===id).DeptName}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth size="small" label="Sub‑Dept" value={subDeptId} onChange={e=>setSubDeptId(e.target.value)} disabled={!deptId}>
                    {subDepts.map(sd=>(<MenuItem key={sd.id} value={sd.id}>{sd.name}</MenuItem>))}
                  </TextField>
                </Grid>
              </Grid>

              <Autocomplete
                options={employees}
                getOptionLabel={emp=>`${emp.empname} (${emp.EmpId})`}
                inputValue={searchTerm}
                onInputChange={(_,v)=>setSearchTerm(v)}
                onChange={handleEmpSelect}
                renderInput={params=><TextField {...params} label="Search Manager" size="small" />}
                noOptionsText="No matches"
                sx={{ mb:2 }}
              />

              {empId && (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <TextField fullWidth size="small" label="Email" value={manager.email} InputProps={{ readOnly:true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <Button fullWidth variant="contained" onClick={handleSubmit}>Add Mapping</Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
