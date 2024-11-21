import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import Box from "@mui/material/Box";


const NextComponents = () =>{


    return (
        <div>
         <Navbar/>
          <Box sx={{ flexGrow: 1, minHeight: "80vh" }}>
         </Box>
         <Footer/>
        </div>
    )
}

export default NextComponents