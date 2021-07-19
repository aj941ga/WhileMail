import React, { useRef } from "react";
import { Route, Redirect } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({
  path,
  component: Component,
  render,
  props,
  user,
  ...rest
}) => {
  const isAuthenticated = () => {
    // check token for expiry
    for (let key in localStorage) {
      if (key.includes("idToken")) {
        let { exp } = jwt_decode(localStorage[key]);
        if (Date.now() >= exp * 1000) {
          return false;
        }
        return true;
      }
    }
    return false;
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated()) {
          return (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location },
              }}
            />
          );
        } else {
          return Component ? <Component {...props} /> : render(props);
        }
      }}
    />
  );
};

export default ProtectedRoute;
