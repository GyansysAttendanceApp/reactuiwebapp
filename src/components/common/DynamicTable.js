import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
} from '@mui/material';
import FadeLoader from 'react-spinners/FadeLoader';
import { colors } from '../../colors/Color';

const DynamicTable = ({ columns, data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    if (orderBy) {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });
  if (!sortedData.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '80vh',
          alignItems: 'center',
          // background: "red",
        }}
      >
        <FadeLoader width={3} height={16} color={colors.primaryColor} />
      </Box>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="dynamic table">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              {columns.map((column) => (
                <TableCell key={column.id}>{row[column.id]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
