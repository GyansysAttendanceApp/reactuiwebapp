// import React , { useState }  from 'react'
// import "../../style/Loginpage.scss"
// import { useNavigate } from 'react-router-dom';

// const Loginpage = () => {

//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     if (email === 'test@example.com' && name === 'John Doe' && password === '12345') {
//       alert('Login successful!');
//       navigate('/');
//     } else {
//       alert('Invalid credentials. Please try again.');
//     }
//   };

//   return (
//     <div className="login-container">

//       <div className="login-card">

//         <h2 className="login-title">Welcome to Gyansys</h2>
//         <div className="input-group">
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your name"
//           />
//         </div>
//         <div className="input-group">
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//           />
//         </div>
//         <button className="login-button" onClick={handleLogin}>
//           Login
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Loginpage

//MUI with out  inLine

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import '../../style/Loginpage.scss';

const Loginpage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'test@gyansys.com' && name === 'test user' && password === 'PSN@12345') {
      alert('Login successful!');
      navigate('/');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h4" component="h1" className="login-title">
            Welcome to Gyansys
          </Typography>
          <Box component="form" noValidate className="login-form">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input"
              placeholder="Enter your name"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Enter your email"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter your password"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="login-button"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Loginpage;
