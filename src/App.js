import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home'; // Adjust the path as necessary
import DirectoryNavigator from './components/directories'; // Adjust the path as necessary
import Navbar from './components/navbar';
import { Footer } from './components/footer';
import Page from './admin/page';
import LoginPage from './pages/login';
import { AuthProvider } from './context/Authcontext'; // Adjust the path if necessary
import ProtectedRoute from './context/ProtectedRoute'; // Adjust the path if necessary
import Main from './pages/main';
import FolderManager from './admin/folders';


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <MainContent />
            </Router>
        </AuthProvider>
    );
};

const MainContent = () => {
    const location = useLocation(); // Get the current route

    return (
        <>
            {/* Conditionally render Navbar and Footer on all pages except the /main route */}
            {location.pathname !== '/main' && <Navbar />}

            <div style={{ marginTop: location.pathname === '/main' ? '0px' : '50px', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/directories" element={<Main />} />
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute>
                                <Page />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/main" element={<Main />} /> {/* Main PDF Viewer Page */}
                    <Route path="/folders" element={<FolderManager />} /> 
                </Routes>
            </div>

            {/* Conditionally render the Footer */}
            {location.pathname !== '/main' && <Footer />}
        </>
    );
};

export default App;
