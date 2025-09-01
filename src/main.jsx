// src/main.jsx
import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/stylesglobal.css';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Verifica se está em produção
const isProduction = import.meta.env.PROD;

// Cria a raiz
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza com ou sem StrictMode
root.render(
  <BrowserRouter>
    <AuthProvider>
      <DataProvider>
        {isProduction ? (
          <React.StrictMode>
            <App />
          </React.StrictMode>
        ) : (
          <App />
        )}
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>
);