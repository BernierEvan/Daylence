import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Preferences from './components/Preferences/Preferences';
import Recette from './Recette';

type AuthToken = {
  token: string;
};

function getToken(): AuthToken | null {
  const tokenString = sessionStorage.getItem('token');

  if (!tokenString) {
    return null;
  }

  try {
    return JSON.parse(tokenString) as AuthToken;
  } catch {
    return null;
  }
}

function App() {
  const [authToken, setAuthToken] = useState<AuthToken | null>(() => getToken());

  const setToken = (userToken: AuthToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setAuthToken(userToken);
  };

  if (!authToken?.token) {
    return <Login setToken={setToken} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/recette" element={<Recette />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
