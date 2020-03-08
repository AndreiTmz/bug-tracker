import React from "react";
import { Redirect } from "react-router-dom";
import ProjectStore from "../stores/projects";
import { GeneralProjectData } from "./GeneralProjectData";
import MembersProjectData from "./MembersProjectData";
import TestersProjectData from "./TestersProjectData";
import UserStore from "../stores/auth";
import BugStore from "../stores/bugs";

export default class Project extends React.Component {
  constructor() {
    super();
    this.pstore = new ProjectStore();
    this.bstore = new BugStore();
    this.store = new UserStore();
    this.state = {
      redirect: !localStorage.token,
      loading: true,
      members: [],
      testers: [],
      bugs: []
    };
  }

  renderRedirectNotLoggedIn = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  reload = () => {
    this.store.loadUser();
    this.pstore.getProject(localStorage.id);
    this.bstore.getBugs(localStorage.id);

    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  };

  componentDidMount() {
    if (localStorage.token) {
      this.store.loadUser();
      this.pstore.getProject(localStorage.id);
      this.pstore.getMembers(localStorage.id);
      this.pstore.getTesters(localStorage.id);
      this.bstore.getBugs(localStorage.id);
    }
    setTimeout(() => {
      this.setState({
        loading: false,
        members: this.pstore.members,
        testers: this.pstore.testers,
        bugs: this.bstore.bugs
      });
      setTimeout(() => {
        this.store.loadUser();
      }, 1000);
    }, 1000);
  }

  render() {
    return (
      <div className="container mb-5">
        {this.renderRedirectNotLoggedIn()}

        {this.state.loading ? (
          ""
        ) : (
          <div>
            <div className="row">
              <div className="col-sm  mx-auto">
                <GeneralProjectData
                  project={this.pstore.project}
                  members={this.state.members}
                />
              </div>
              <div className="col-sm mx-auto text-center">
                {this.store.user.projects.filter(
                  p => p.id === this.pstore.project.id
                )[0] &&
                  this.store.user.projects.filter(
                    p => p.id === this.pstore.project.id
                  )[0].project_access.accessType === "MP" && (
                    <MembersProjectData
                      testers={this.state.testers}
                      bugs={this.state.bugs}
                    />
                  )}
                {!this.store.user.projects.filter(
                  p => p.id === this.pstore.project.id
                )[0] && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      this.pstore.addTester(this.pstore.project.id);
                      setTimeout(() => {
                        this.pstore.getAllProjects();
                        this.store.loadUser();
                        setTimeout(() => {
                          this.setState({ loading: false });
                        }, 500);
                      }, 500);
                    }}
                  >
                    Become Tester
                  </button>
                )}
                {this.store.user.projects.filter(
                  p => p.id === this.pstore.project.id
                )[0] &&
                  this.store.user.projects.filter(
                    p => p.id === this.pstore.project.id
                  )[0].project_access.accessType === "TST" && (
                    <TestersProjectData
                      bugs={this.state.bugs}
                      reload={this.reload}
                    />
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
