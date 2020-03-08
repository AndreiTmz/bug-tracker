import React from "react";
import { Redirect, Link } from "react-router-dom";
import BugStore from "../stores/bugs";

export default class AddBug extends React.Component {
  constructor() {
    super();
    this.bstore = new BugStore();
    this.state = {
      redirectDone: false,
      error: undefined
    };
  }

  handleSubmitBug = e => {
    e.preventDefault();
    const severity = document.querySelector("#severity");
    const priority = document.querySelector("#priority");
    const description = e.target.elements.description.value;
    const commitLink = e.target.elements.commitLink.value;
    let error;
    if (
      e.target.elements.severity.options[severity.selectedIndex].value === ""
    ) {
      error = "Select an option for severity";
    } else if (
      e.target.elements.priority.options[priority.selectedIndex].value === ""
    ) {
      error = "Select an option for priority";
    } else if (description === "") {
      error = "Add a description";
    } else if (commitLink === "") {
      error = "Add a commit link";
    }
    this.setState(() => ({ error }));
    if (!error) {
      this.setState(() => ({ redirectDone: true }));
      this.bstore.addBug(
        localStorage.id,
        description,
        commitLink,
        e.target.elements.severity.options[severity.selectedIndex].value,
        e.target.elements.priority.options[priority.selectedIndex].value,
        localStorage.email,
        "",
        "",
        "unassigned"
      );
    }
  };

  renderRedirect = () => {
    if (this.state.redirectDone || !localStorage.id) {
      return <Redirect to="/" />;
    } else if (!localStorage.token) {
      return <Redirect to="/login" />;
    }
  };

  render() {
    return (
      <div className="col-sm-10 col-md-8 col-lg-6 mx-auto my-3 signup-form">
        <div className="card card-body bg-secondary">
          <div className="card-title text-center text-white">
            <h2 className="text-capitalize">Add a bug!</h2>
          </div>
          {this.renderRedirect()}
          {this.state.error && (
            <p className="py-2 text-danger">{this.state.error}</p>
          )}
          <form onSubmit={this.handleSubmitBug}>
            <select
              className="custom-select form-control-lg my-2"
              name="severity"
              id="severity"
            >
              <option value="">- severity select -</option>
              <option value="cosmetic">Trivial</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critic">Critic</option>
            </select>
            <select
              className="custom-select form-control-lg my-2"
              name="priority"
              id="priority"
            >
              <option value="">- priority select -</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <textarea
              className="form-control form-control-lg my-2"
              rows="4"
              cols="50"
              name="description"
              placeholder="Bug Description"
            />
            <div className="form-group mt-3">
              <input
                type="url"
                name="commitLink"
                className="form-control form-control-lg"
                placeholder="Commit Link"
              />
            </div>
            <Link
              to="/"
              className="btn btn-outline-dark btn-block text-uppercase"
            >
              Back Home
            </Link>
            {this.renderRedirect()}
            <button
              type="submit"
              className="btn btn-outline-dark btn-block text-uppercase"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}
