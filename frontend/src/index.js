import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/auth-context';
import { ThemeProvider } from './context/theme-context';
import { GlobalProvider } from './context/global-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <GlobalProvider>
            <App />
            <ToastContainer />
          </GlobalProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

