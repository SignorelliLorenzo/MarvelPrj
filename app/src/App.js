// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import MainPage from "./Components/MainPage";
import { ThemeProvider } from '@mui/material/styles';
import PrivateRoute from "./privateroute";
import genericTheme from './Theme/AppTheme';
import './App.css';
function App() {
  return (
    <ThemeProvider theme={genericTheme}>
    <Router>
      <Routes>
      <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainPage />
                <Outlet />
              </PrivateRoute>
            }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;