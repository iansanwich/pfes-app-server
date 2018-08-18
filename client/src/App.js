import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Users from "./components/admin/users/Users";
import AlertBox from "./components/application/AlertBox";
import ApplicationNav from "./components/application/ApplicationNav";
import Logs from "./components/application/Logs";
import Calendar from "./components/application/calendar/Calendar";
import Statistics from "./components/application/statistics/Statistics";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current profile

    //  Redirect to login
    window.location.href = "/";

    console.log("token expired");
  }
}

class App extends Component {
  render() {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;

    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />

            <AlertBox />

            <div className="fade-in-2 container-fluid mobile-margin">
              <Switch>
                {/* Login */}
                <Route exact path="/" component={Login} />
                {/* App navigation tabs */}
                <Route path="/app" component={ApplicationNav} />
                {/* 404 */}
                <Route render={() => <h1>Not found</h1>} />
              </Switch>

              <Route
                exact
                path="/app"
                render={() =>
                  isAuthenticated ? (
                    <Redirect to="/app/logs" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
            </div>

            <div className="fade-in container-fluid ">
              {/* Log management */}
              <Route exact path="/app/logs" component={Logs} />

              {/* Calendar */}
              <Route exact path="/app/calendar" component={Calendar} />

              {/* Statistics */}
              <Route exact path="/app/statistics" component={Statistics} />

              {/* Admin - user management */}
              <Route exact path="/app/users" component={Users} />
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
