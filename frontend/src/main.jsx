import { StrictMode } from 'react'
import App from './App.jsx'
import * as React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
root.render(
  <StrictMode>
    <App/>
  </StrictMode>
);