import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import constraints from "../../constraints";
import "../../style/Footer.scss";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <Box className="footer_container">
      <Typography variant="boday2" sx={{ color: "white" }}>
        {constraints.FOOTER.COPY_RIGHT.TITLE} {currentYear}
        {constraints.FOOTER.COPY_RIGHT.COMPANY_NAME}
      </Typography>
    </Box>
  );
}

export default Footer;
