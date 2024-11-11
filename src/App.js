import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home"; // Adjust the path as necessary
import Page from "./admin/page";
import LoginPage from "./pages/login";
import { AuthProvider } from "./context/Authcontext"; // Adjust the path if necessary
import ProtectedRoute from "./context/ProtectedRoute"; // Adjust the path if necessary
import Main from "./components/main";  // Adjust the path as necessary
import Faq from '../src/admin/faq';
import PdfViewer from "./components/pdfviewer";

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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/start" element={<Main />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/pdf" element={<PdfViewer />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Page />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
