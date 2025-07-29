"use client";

import { useEffect } from 'react';
import { initToolbar } from '@stagewise/toolbar';

const stagewiseConfig = {
  plugins: [],
};

function StagewiseToolbarInitializer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initToolbar(stagewiseConfig);
    }
  }, []);

  return null; // This component doesn't render anything
}

export default StagewiseToolbarInitializer; 