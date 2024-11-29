import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { PiMicrosoftTeamsLogoFill } from 'react-icons/pi';
import FadeLoader from 'react-spinners/FadeLoader';
import { GoMail } from 'react-icons/go';
import { VscOrganization } from 'react-icons/vsc';
import { BiFemale, BiMale } from 'react-icons/bi';
import { colors } from '../../colors/Color';

const UserInformation = ({
  error,
  fetchHistoryError,
  selectedItem,
  selectedItemAllEntries,
  employeeDetailsLoading,
}) => {

  return (
    <Box sx={{
       overflow: 'auto',
        maxHeight: '56.5vh',
        marginTop:'0.8rem'
         }}>
      <Box>
        {selectedItem ? (
          <Card
            variant="outlined"
            sx={{
              boxShadow: 2,
              bgcolor: selectedItem.SwipeDateTime === 'ABSENT' ? '#f43636d4' : '#90EE90',
            }}
          >
            <CardContent sx={{}}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Typography variant="body2" fontWeight={'bold'} mb={1}>
                    User Information
                  </Typography>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    {selectedItem.EmpGender === 'Male' ? (
                      <BiMale size={28} sx={{ backgroundColor: '#3658f4d4' }} />
                    ) : (
                      <BiFemale size={26} sx={{ backgroundColor: '#d6338f' }} />
                    )}
                    <Typography variant="body3">
                      {selectedItem.EmpName} ({selectedItem.EmpID})
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <GoMail size={20} sx={{ backgroundColor: '#d6338f' }} />
                    <Typography variant="body3">
                      &nbsp;
                      <a href={`mailto:${selectedItem.EmpEmail}`} target="_blank">
                        {selectedItem.EmpEmail}
                      </a>
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <VscOrganization size={20} sx={{ backgroundColor: '#d6338f' }} />
                    <Typography variant="body3">&nbsp;{selectedItem.DeptName}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <PiMicrosoftTeamsLogoFill size={20} sx={{ backgroundColor: '#d6338f' }} />
                    <Typography variant="body3">
                      &nbsp;
                      <a
                        href={`https://teams.microsoft.com/l/chat/0/0?users=${selectedItem.EmpEmail}`}
                        target="_blank"
                      >
                        Chat
                      </a>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Typography variant="body2" fontWeight={'bold'} mb={1}>
                    Swipe Information
                  </Typography>
                  {selectedItem.SwipeDateTime === 'ABSENT' ? (
                    <Typography variant="body3" sx={{ color: 'red' }}>
                      ABSENT
                    </Typography>
                  ) : (
                    <Table>
                      <TableBody>
                        {selectedItemAllEntries.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ border: 'none' ,padding:'0.1rem'}}>
                              {item.SwipeDateTime} - {item.InOut} - {item.FloorDoorName}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <>
            <Typography variant="body3" color="red">
              {error}
            </Typography>
            {fetchHistoryError && (
              <Typography variant="body3" color="error">
                {fetchHistoryError}
              </Typography>
            )}
          </>
        )}
        {selectedItem?.length === 0 && employeeDetailsLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '20vh',
              alignItems: 'center',
              // background: "red",
            }}
          >
            <FadeLoader width={3} height={16} color={colors.primaryColor} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserInformation;
