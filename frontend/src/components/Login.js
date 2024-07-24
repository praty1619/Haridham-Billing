import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import { styled } from '@mui/system';
import './AdminDashboard.css';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start', // Align items to the top
  height: '100vh',
  paddingTop: '5vh', // Add some padding to the top
  backgroundColor: '#f5f5f5',
});

const StyledCard = styled(Card)({
  width: '100%',
  maxWidth: 400,
  padding: 16,
  boxShadow: '0px 3px 6px rgba(0,0,0,0.16)',
  borderRadius: 8, // More rectangular shape with slight rounding
});

const Title = styled(Typography)({
  textAlign: 'center',
  marginBottom: 16,
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const LoginButton = styled(Button)({
  marginTop: 16,
});

const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <div className="banner">
        <h1>श्री हरिधाम बांध ट्रस्ट समिति (रजिo)</h1>
        <p>ग्राम-मौलनपुर, पोस्ट-गवा, जिला सम्भल (उ.प्र.)</p>
        <div className="subheading">
        <p>दिनांक: {getCurrentDate()}</p>
        </div>
      </div>
      <Root>
        <StyledCard>
          <CardContent>
            <Title variant="h4">Login</Title>
            {error && <Alert severity="error">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <LoginButton type="submit" variant="contained" color="primary" fullWidth>
                Login
              </LoginButton>
            </Form>
          </CardContent>
        </StyledCard>
      </Root>
    </div>
  );
};

export default Login;
