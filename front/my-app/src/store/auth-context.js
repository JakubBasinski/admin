import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: true,
  login: (token) => {},
  logout: () => {},
});

const retriveStored = () => {
  const storedToken = localStorage.getItem('token');
  return { token: storedToken };
};

export const AuthContextProvider = (props) => {
  const tokenData = retriveStored();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
