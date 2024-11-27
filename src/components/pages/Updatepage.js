import React from 'react'
import { Paper, Typography, Button, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import "../../style/Updatepage.css"
const Updatepage= () => {
  return (
    <div className='Updatepage'>
      <Paper className="paper" >
        <Typography variant="h4" gutterBottom>
          Coming Soon!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Page is under progress, stay tuned!
        </Typography>
        <Link to = "/">
    
        <Button>
          Go to Home
        </Button>
        </Link>
      </Paper>
        
</div>
  )
}

export default Updatepage