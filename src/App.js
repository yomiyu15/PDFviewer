import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home'; // Adjust the path as necessary
import DirectoryNavigator from './components/directories'; // Adjust the path as necessary
import Navbar from './components/navbar';
import { Footer } from './components/footer';
import Page from './admin/page';
import LoginPage from './pages/login';
import { AuthProvider } from './context/Authcontext'; // Adjust the path if necessary
import ProtectedRoute from './context/ProtectedRoute'; // Adjust the path if necessary
import Main from './pages/main';
import { Box } from '@mui/material';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
          <Box sx={{ flexGrow: 1, marginTop: '50px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/directories" element={<DirectoryNavigator />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Page />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/main" element={<Main />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
