import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box sx={{ height: "100vh" }}>
      <Box>
        <Navbar />
      </Box>
      <Box
        sx={{
          minHeight: "86vh",
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          height: "4vh",
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
