import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Make PrivateRoute a wrapper around Route
const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          Component // Render the provided component if authenticated
        ) : (
          <Navigate to="/" /> // Redirect to login page if not authenticated
        )
      }
    />
  );
};

export default PrivateRoute;