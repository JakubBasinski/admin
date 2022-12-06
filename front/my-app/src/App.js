import './App.css';
import React, { useContext } from 'react';
import Layout from './components/Layout/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PanelPage from './pages/PanelPage';
import AuthContext from './store/auth-context';

let App = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/panel"
          element={authCtx.isLoggedIn ? <PanelPage /> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
};

export default App;
