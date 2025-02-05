import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          Component
        ) : (
          <Navigate to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;