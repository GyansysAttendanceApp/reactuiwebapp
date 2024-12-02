import React , { useState }  from 'react'
import "../../style/Loginpage.scss"
import { useNavigate } from 'react-router-dom';

const Loginpage = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    if (email === 'test@example.com' && name === 'John Doe' && password === '12345') {
      alert('Login successful!');
      navigate('/'); 
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  
  return (
    <div className="login-container"> 
    
      <div className="login-card">

        <h2 className="login-title">Welcome to Gyansys</h2>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
       
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Loginpage