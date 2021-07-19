import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import { Route, Redirect, Switch } from "react-router-dom";
import ProtectedRoute from './components/common/protectedRoute';
import NotFound from "./components/common/notFound";
import Mails from './components/group/mails';
import MailLogs from './components/group/mailLogs';
import MailStepper from "./components/group/mailStepper";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import NavBar from "./components/navBar";

import OauthCallback from './components/auth/callback';
import LoginContext from './contexts/loginContext';
import LoginModal from "./components/auth/loginModal";
import { Auth, Hub } from "aws-amplify";

import httpService from './services/httpService';

function App() {

  const [show, setShow] = useState(false);
  const [user, updateUser] = useState(null);

  useEffect(() => {
    if (!user) {
      checkUser();
    }
  }, [user]);


  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      httpService.setJwt(user.storage[`${user.keyPrefix}.${user.username}.idToken`]);
      updateUser(user);
      // window.location='/';
    } catch (err) {
      localStorage.clear();
      console.log(err);
    }
  }

    return (
      <LoginContext.Provider value={{
        setShow, show, user
      }} >
      <div className="App">
          <ToastContainer />
          <LoginModal updateUser={updateUser} />
          <NavBar user={user} updateUser={updateUser} />
          <Switch>
            <Route path="/home" component={Home} />
            <ProtectedRoute
              path="/mailForm/:id"
              render={props => <MailStepper {...props} user={user} />}
            />
            <ProtectedRoute
              path="/history"
              component={MailLogs}
            />
            <ProtectedRoute path="/mails"
              render={props => <Mails {...props} user={user} />}></ProtectedRoute>
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect exact from="/" to="/mails" />
            <Redirect to="/not-found" />
          </Switch>
      </div>
      </LoginContext.Provider>
    );
}

function Home() {

  return (
    <h1>welcome to home page</h1>
  )
}

export default App;
