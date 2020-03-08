import React from "react";
import { Link } from "react-router-dom";
import UserStore from "../stores/auth";
import ProjectStore from "../stores/projects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faPlusCircle, faTrashAlt);

export default class Main extends React.Component {
  constructor() {
    super();
    this.store = new UserStore();
    this.pstore = new ProjectStore();
    this.state = {
      loading: true,
      projects: []
    };
  }

  componentDidMount() {
    this.pstore.getAllProjects();
    if (this.props.loggedEmail) {
      this.store.loadUser();
    }
    setTimeout(() => {
      this.store.loadUser();
      setTimeout(() => {
        this.setState({ loading: false });
      }, 500);
      setTimeout(() => {
        if (localStorage.token) {
          this.setState({ loading: false, projects: this.pstore.projects });
        }
      }, 1000);
    }, 500);
  }

  render() {
    return (
      <div className="container">
        {this.state.loading ? (
          " "
        ) : (
          <div className="row my-4">
            <Link
              className="col-sm btn btn-black text-uppercase filter-btn text-primary m-2"
              to={{ pathname: "/add-project" }}
            >
              <FontAwesomeIcon
                icon="plus-circle"
                className="text-primary font-icon"
              />{" "}
              Add Project
            </Link>

            <section id="member_projects" className="col-sm text-center my-3">
              <p>Member projects</p>
              <ul className="pl-0">
                {localStorage.token &&
                  this.store.user &&
                  this.store.user.projects.length !== 0 &&
                  this.store.user.projects.map(
                    (project, i) =>
                      project.project_access.accessType === "MP" && (
                        <li key={i}>
                          <Link
                            className="pr-2"
                            to={{ pathname: "/project", selected: project.id }}
                            onClick={() =>
                              localStorage.setItem("id", project.id)
                            }
                          >
                            {project.projectName}
                          </Link>
                          <FontAwesomeIcon
                            onClick={() => {
                              this.pstore.deleteProject(project.id);
                              setTimeout(() => {
                                this.pstore.getAllProjects();
                                this.store.loadUser();
                                setTimeout(() => {
                                  this.setState({
                                    projects: this.pstore.projects
                                  });
                                }, 500);
                              }, 500);
                            }}
                            icon="trash-alt"
                            className="text-danger font-icon ml-3"
                          />
                        </li>
                      )
                  )}
              </ul>
            </section>
            <section id="tester_projects" className="col-sm text-center my-3">
              <p>Tester projects</p>
              <ul className="pl-0">
                {localStorage.token &&
                  this.store.user &&
                  this.store.user.projects.length !== 0 &&
                  this.store.user.projects.map(
                    (project, i) =>
                      project.project_access.accessType === "TST" && (
                        <li key={i}>
                          <Link
                            to={{ pathname: "/project", selected: project.id }}
                            onClick={() =>
                              localStorage.setItem("id", project.id)
                            }
                          >
                            {project.projectName}
                          </Link>
                        </li>
                      )
                  )}
              </ul>
            </section>

            <section
              id="all_projects"
              className="col-sm text-center mx-auto my-3"
            >
              <p>All projects</p>
              <ul className="pl-0">
                {this.pstore.projects.map((project, i) => (
                  <li key={i} className="mx-0">
                    <Link
                      className="mx-0"
                      to={{ pathname: "/project", selected: project.id }}
                      onClick={() => localStorage.setItem("id", project.id)}
                    >
                      {project.projectName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    );
  }
}
