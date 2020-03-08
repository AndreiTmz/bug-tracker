import React from "react";
import MemberEmailInput from "./MemberEmailInput";
import ProjectStore from "../stores/projects";
import { Redirect, Link } from "react-router-dom";

export default class AddProject extends React.Component {
  constructor() {
    super();
    this.pstore = new ProjectStore();
    this.state = {
      memberInputs: [],
      redirect: !localStorage.token,
      redirectDone: false,
      error: undefined
    };
  }

  componentDidMount() {
    this.pstore.getAllProjects();
  }

  handleSubmitProject = e => {
    e.preventDefault();
    const projectName = e.target.elements.projectName.value;
    const projectDescription = e.target.elements.projectDescription.value;
    const repositoryLink = e.target.elements.repositoryLink.value;
    var membersArray = [localStorage.email];
    let error;
    if (projectName === "") {
      error = "Add a name for the project";
    } else if (projectDescription === "") {
      error = "Add a description for the project";
    } else if (repositoryLink === "") {
      error = "Add a link for the repository";
    } else if (this.state.memberInputs.length !== 0) {
      var errCont = 0;
      this.state.memberInputs.forEach((element, index) => {
        let current = document.querySelector(
          `#${this.state.memberInputs[index]}`
        );
        if (current.value === "") {
          errCont++;
          console.log(errCont);
        } else {
          membersArray.push(current.value);
        }
      });
      if (errCont !== 0) {
        error = "Add email adresses for all members";
      }
    } else {
      var found = 0;
      this.pstore.projects.forEach(project => {
        if (repositoryLink === project.repositoryLink) {
          found++;
        }
      });
      if (found) {
        error = "Existent project";
      }
    }

    this.setState(() => ({ error }));
    if (!error) {
      this.pstore.addProject(projectName, repositoryLink, projectDescription);
      setTimeout(() => {
        this.pstore.getAllProjects();
      }, 500);
      this.setState(() => ({ redirectDone: true }));
    }
  };

  handleAddMember = e => {
    e.preventDefault();
    let newInput = `input${this.state.memberInputs.length}`;
    this.setState(prevState => ({
      memberInputs: prevState.memberInputs.concat([newInput])
    }));
  };
  handleDeleteInput = inputToRemove => {
    this.setState(prevState => ({
      memberInputs: prevState.memberInputs.filter(
        input => inputToRemove !== input
      )
    }));
  };

  renderRedirectNotLoggedIn = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  renderRedirect = () => {
    if (this.state.redirectDone) {
      return <Redirect to="/" />;
    }
  };

  render() {
    return (
      <div>
        <div className="col-sm-10 col-md-8 col-lg-6 mx-auto my-3 signup-form">
          <div className="card card-body bg-secondary">
            <div className="card-title text-center text-white">
              <h2 className="text-capitalize">Add a project!</h2>
            </div>
            {this.renderRedirectNotLoggedIn()}
            {this.state.error && (
              <p className="text-danger">{this.state.error}</p>
            )}
            <form onSubmit={this.handleSubmitProject}>
              <div className="form-group mt-3">
                <input
                  type="text"
                  name="projectName"
                  className="form-control form-control-lg"
                  placeholder="Project Name"
                />
              </div>
              <div className="form-group mt-3">
                <input
                  type="text"
                  name="repositoryLink"
                  className="form-control form-control-lg"
                  placeholder="Repository Link"
                />
              </div>
              <div className="form-group mt-3">
                <textarea
                  type="text"
                  name="projectDescription"
                  rows="4"
                  cols="50"
                  className="form-control form-control-lg"
                  placeholder="Project Description"
                ></textarea>
              </div>
              {this.state.memberInputs.map((memberInput, index) => (
                <MemberEmailInput
                  key={memberInput}
                  id={memberInput}
                  count={index + 1}
                  handleDeleteInput={this.handleDeleteInput}
                />
              ))}
              <button
                type="button"
                className="btn btn-outline-dark btn-block text-uppercase"
                onClick={this.handleAddMember}
              >
                {" "}
                Add Member
              </button>
              <button
                type="submit"
                className="btn btn-outline-dark btn-block text-uppercase"
              >
                Submit
              </button>
              <Link to="/" className="btn btn-secondary m-2">
                Back Home
              </Link>
              {this.renderRedirect()}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
