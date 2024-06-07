"use client"
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbars from '@/components/navbar';
import Login from '@/components/login';
import SingUp from '@/components/singup';
import Taxe from '@/components/taxe';
import "./globals.css";
import '../components/components.css';
import HeroBanner from '@/components/heroBanner';

export default function Home() {

  return (
    <Router>
      <Navbars />
      <HeroBanner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SingUp />} />
        <Route path="/taxe" element={<Taxe />} />
      </Routes>
    </Router>

  );
}
