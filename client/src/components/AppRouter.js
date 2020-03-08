import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "../components/Header";
import LogInPage from "../components/LogInPage";
import RegisterPage from "../components/RegisterPage";
import Main from "../components/Main";
import AddProject from "../components/AddProject";
import AddBug from "../components/AddBug";
import NotFoundPage from "./NotFoundPage";
import Project from "./Project";
import UserStore from "../stores/auth";

export default class AppRouter extends React.Component {
  constructor() {
    super();
    this.store = new UserStore();
    this.state = {
      loggedEmail: localStorage.email
    };

    this.login = emailValue => {
      this.setState(() => ({ loggedEmail: emailValue }));
    };

    this.logout = () => {
      this.setState(() => ({ loggedEmail: "" }));
      this.store.logout();
    };
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header loggedEmail={this.state.loggedEmail} logout={this.logout} />
          <Switch>
            <Route
              path="/"
              render={props => (
                <Main {...props} loggedEmail={this.state.loggedEmail} />
              )}
              exact
            />
            <Route
              path="/login"
              render={props => <LogInPage {...props} login={this.login} />}
              exact
            />
            <Route path="/register" component={RegisterPage} exact />
            <Route extact path="/project" component={Project} />
            <Route path="/add-project" component={AddProject} exact />
            <Route path="/add-bug" component={AddBug} exact />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
