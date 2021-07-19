import React, { useContext, useState, useEffect } from "react";
import LoginContext from "../../contexts/loginContext";
import { Redirect, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { Auth, Hub } from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const initialFormState = {
  username: "",
  password: "",
  email: "",
  authCode: "",
  formType: "signUp",
  error: "",
};

function LoginModal({ updateUser }) {
  const loginContext = useContext(LoginContext);
  const history = useHistory();

  const [formState, updateFormState] = useState(initialFormState);

  const handleClose = () => {
    loginContext.setShow(!loginContext.show);
  };
  function onChange(e) {
    e.persist();
    updateFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleError(ex) {
    updateFormState({ ...formState, error: ex.message });
  }

  async function signUp() {
    const { username, email, password } = formState;
    try {
      await Auth.signUp({ username, password, attributes: { email } });
      updateFormState({ ...formState, formType: "confirmSignUp" });
    } catch (ex) {
      handleError(ex);
    }
  }
  async function confirmSignUp() {
    const { username, authCode } = formState;
    try {
      await Auth.confirmSignUp(username, authCode);
      updateFormState({ ...formState, formType: "signIn" });
    } catch (ex) {
      handleError(ex);
    }
  }
  async function signIn() {
    const { username, password } = formState;
    try {
      const user = await Auth.signIn(username, password);
      // updateUser(user);
      history.push("/mails");
      updateFormState({ ...formState, formType: "signedIn" });
    } catch (ex) {
      handleError(ex);
    }
  }

  const { formType, error } = formState;
  return (
    <div>
      <Dialog
        open={loginContext.show}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{formType}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <>
            {formType === "signUp" && (
              <div>
                <CustomTextField
                  name="username"
                  type="username"
                  onChange={onChange}
                />
                <CustomTextField
                  name="password"
                  type="password"
                  onChange={onChange}
                />
                <CustomTextField
                  name="email"
                  type="email"
                  onChange={onChange}
                />
                <div>
                  Already Signed up? login{" "}
                  <Link
                    href="#"
                    onClick={() =>
                      updateFormState({ ...formState, formType: "signIn" })
                    }
                  >
                    here
                  </Link>
                </div>
                <Button onClick={signUp} variant="contained">
                  sign Up
                </Button>
              </div>
            )}
            {formType === "confirmSignUp" && (
              <div>
                <CustomTextField
                  name="authCode"
                  label="confirmation code"
                  onChange={onChange}
                />
                <Button onClick={confirmSignUp} variant="contained">
                  Confirm Sign Up
                </Button>
              </div>
            )}
            {formType === "signIn" && (
              <div>
                <CustomTextField name="username" onChange={onChange} />
                <CustomTextField
                  name="password"
                  type="password"
                  onChange={onChange}
                />
                <div>
                  Not Registered? Register{" "}
                  <Link
                    href="#"
                    onClick={() =>
                      updateFormState({ ...formState, formType: "signUp" })
                    }
                  >
                    here
                  </Link>
                </div>
                <Button onClick={signIn} variant="contained">
                  Sign In
                </Button>
              </div>
            )}
            {error && <Alert severity="error">{error}</Alert>}
          </>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Submit
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

function CustomTextField({ name, type, label, onChange: handleChange }) {
  if (!label) label = name;
  if (!type) type = "text";

  return (
    <TextField
      autoFocus
      margin="dense"
      id={name}
      label={label}
      type={type}
      name={name}
      onChange={handleChange}
      fullWidth
    />
  );
}

export default LoginModal;
