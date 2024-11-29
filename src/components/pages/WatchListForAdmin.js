import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import constraints from '../../constraints';
import { PiMicrosoftTeamsLogoFill } from 'react-icons/pi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const WatchListForAdmin = ({ groupedWatchlist ,selectedItem}) => {
  return (
    <Box sx={{ overflow: 'auto', maxHeight: '68.5vh', marginTop: '0.5rem' }}>
      {selectedItem && ( //selectedItem
        <Box>
          <Accordion sx={{ backgroundColor: '' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ backgroundColor: '#5DADE2' }}
            >
              <Typography variant="h5" sx={{ color: '#FFFFFF' }}>
                {constraints.DATATABLE.WATCH_LIST.TITLE}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {Object.entries(groupedWatchlist).map(([watchlistName, employees], index) => (
                  <Accordion key={index} sx={{ marginBottom: '10px' }} defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${watchlistName}-content`}
                      id={`${watchlistName}-header`}
                      sx={{ backgroundColor: '#ECF0F1' }}
                    >
                      <Typography>
                        <em>{watchlistName}</em>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer sx={{ marginTop: '5px' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography variant="h6">
                                  {constraints.DATATABLE.WATCH_LIST.EMPLOYEE_NAME}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="h6">
                                  {constraints.DATATABLE.WATCH_LIST.IN_TIME}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="h6">
                                  {constraints.DATATABLE.WATCH_LIST.OUT_TIME}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {employees.map((employee, i) => (
                              <TableRow key={i}>
                                <TableCell>
                                  <a
                                    href={`https://teams.microsoft.com/l/chat/0/0?users=${employee.EmployeeEmail}`}
                                    target="_blank"
                                  >
                                    <PiMicrosoftTeamsLogoFill
                                      size={20}
                                      sx={{
                                        backgroundColor: '#d6338f',
                                      }}
                                    />
                                  </a>
                                  &nbsp;
                                  <a
                                    href={`mailto:${employee.EmployeeEmail}`}
                                    style={{ textDecoration: 'none' }}
                                  >
                                    {employee.EmployeeName}
                                  </a>
                                </TableCell>
                                <TableCell align="right">{employee.InTime}</TableCell>
                                <TableCell align="right">{employee.OutTime}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default WatchListForAdmin;
