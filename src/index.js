// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme(); // You can customize the theme here

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* This helps normalize styles */}
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
