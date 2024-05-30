"use client"


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbars from '@/components/navbar';
import Login from '@/components/login';
import SingUp from '@/components/singup';

function App() {
  return (
    <Router>
      <Navbars />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<SingUp />} />
      </Routes>
    </Router>
  );
}

export default App;
