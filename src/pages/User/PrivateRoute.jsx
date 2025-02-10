import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);

  useEffect(() => {
    // This ensures the route updates when the authentication state changes
    if (!isAuthenticated) {
      // Optionally, you can clear any token in localStorage or do other cleanup
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    null
  );
};

export default PrivateRoute;
