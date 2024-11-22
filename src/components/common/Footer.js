import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


function Footer() {
 const currentYear = new Date().getFullYear();
  const scrollToSearchBox = () => {
    const searchBox = document.getElementById("searchBox");
    searchBox.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          p: 1,      
          backgroundColor: "#1670b9",
        }}
      >
        <Typography
          
          sx={{ fontWeight: "thin",  color: "white" }}
        >
        @ Copyright {currentYear} - GyanSys Infotech Pvt Ltd.
        </Typography>
      </Box>
      
    </div>
  );
}

export default Footer;



