"use client";

import dynamic from 'next/dynamic';
import Home from '../page';

// Ensure our app is client-side only
const JoinsVisualizer = () => {
  return <Home />;
};

export default JoinsVisualizer; 