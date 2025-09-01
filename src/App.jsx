import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FakeNewsDetection from './components/FakeNewsDetection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fake-news-detection" element={<FakeNewsDetection />} />
    </Routes>
  );
}

export default App;
