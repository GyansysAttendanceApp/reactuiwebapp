
 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useMsal } from '@azure/msal-react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Watchlist() {
  const { instance, accounts } = useMsal();
  const [watchlist, setWatchlist] = useState([]);
  const email = accounts[0].username;
  const url = `${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}`
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`${url}/watchlist/${email}`);
        console.log("watchlist", response.data);
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist data: ", error);
      }
    };

    fetchWatchlist();
  }, [email]);

  const handleDeleteWatchlist = async () => {
    if (selectedWatchlistId !== null) {
      try {
        const response = await axios.delete(`${url}/watchlist/${email}/${selectedWatchlistId}`);
        console.log(response.data);
        console.log("deletewatchlist", response);
        setWatchlist(watchlist.filter(item => item.ID !== selectedWatchlistId));
        setSelectedWatchlistId(null);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error deleting watchlist: ", error);
      }
    }
  };

  const openDeleteDialog = (watchlistId) => {
    setSelectedWatchlistId(watchlistId);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedWatchlistId(null);
  };
// debugger;
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this watchlist?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteWatchlist} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div>
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
            Watch List Maintenance
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
          <Link to="/watchlistform" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              New Watch List
            </Button>
          </Link>
        </Box>

        <Box sx={{ overflowX: "auto", width: "95%", margin: "auto", minHeight: "68vh"}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Owner</b></TableCell>
                <TableCell><b>Count of Employees</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {watchlist.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.WatchListName}</TableCell>
                  <TableCell>{item.WatchListPrimaryOwnerName}</TableCell>
                  <TableCell>{item.CountOfEmployees}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" sx={{ marginRight: "5px" }}
                      component={Link}
                      to={`/watchlistform/${item.ID}`}
                    >
                      <FaUserEdit />
                    </Button>
                    <Button variant="contained" color="secondary"
                      sx={{ marginRight: "5px" }}
                      onClick={() => openDeleteDialog(item.ID)}
                    >
                      <MdDeleteForever />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </div>
    </>
  );
}

export default Watchlist;






