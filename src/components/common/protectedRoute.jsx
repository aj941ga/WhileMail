import React, { useRef } from "react";
import { Route, Redirect } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import authService from "../../services/authService";

const ProtectedRoute = ({
  path,
  component: Component,
  render,
  props,
  user,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authService.getCurrentUserFromStorage()) {
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
