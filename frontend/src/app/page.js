"use client"
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbars from '@/components/navbar';
import Login from '@/components/login';
import SingUp from '@/components/singup';
import Regulation from '@/components/regulation';

export default function Home() {
  return (
    <Router>
      <Navbars />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<SingUp />} />
        <Route path="/regulation" element={<Regulation />} />
      </Routes>
    </Router>
  );
}
