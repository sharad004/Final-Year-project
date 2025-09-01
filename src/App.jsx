import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FakeNewsDetection from './components/FakeNewsDetection';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fake-news-detection" element={<FakeNewsDetection />} />
      <Route path="/Admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
