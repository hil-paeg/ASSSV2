
import React from 'react';

const Index: React.FC = () => {
  if (typeof window !== 'undefined') {
    window.location.replace('/dashboard');
  }
  return null;
};

export default Index;
