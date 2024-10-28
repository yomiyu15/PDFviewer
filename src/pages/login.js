import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useAuth } from "../context/Authcontext"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#00adef",
    },
  },
});

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      login(); // Call the login function to update authentication state
      console.log("Login successful:", token);

      // Redirect to /admin after successful login
      navigate('/admin');
    } catch (err) {
      console.error("Login failed:", err.response.data);
      setError("Invalid username or password");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage: "url(https://images.pexels.com/photos/434337/pexels-photo-434337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)", // Background image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'relative',
          // Adding an overlay for better text readability
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
            zIndex: 1,
          },
        }}
      >
        <Paper
          elevation={4} // Increased elevation for depth
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Subtle shadow
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Please log in to your account
          </Typography>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px', // Rounded corners
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px', // Rounded corners
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    marginTop: 2,
                    borderRadius: '20px', // Rounded button
                    '&:hover': {
                      backgroundColor: '#005f8d', // Darker on hover
                    },
                  }}
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </form>
          
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
