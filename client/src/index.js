import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider hideIconVariant
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}>
    <App />
  </SnackbarProvider>
);

