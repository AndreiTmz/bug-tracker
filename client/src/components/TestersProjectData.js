import React from "react";
import { Link } from "react-router-dom";
import UserStore from "../stores/auth";
import ProjectStore from "../stores/projects";
import BugStore from "../stores/bugs";
import Bug from "./Bug";

export default class TestersProjectData extends React.Component {
  constructor() {
    super();
    this.store = new UserStore();
    this.pstore = new ProjectStore();
    this.bstore = new BugStore();
  }

  render() {
    return (
      <div>
        <Link className="btn btn-success m-2" to="/add-bug">
          Add Bug
        </Link>
        <button
          type="button"
          className="btn btn-danger m-2"
          onClick={() => {
            this.pstore.removeTester(localStorage.id);
            this.props.reload();
          }}
        >
          Remove tester
        </button>
        <p>{this.props.bugs.length} bug(s) submitted</p>
        <ol>
          {this.props.bugs.length !== 0 &&
            this.props.bugs.map((item, index) => (
              <Bug key={index} bug={item} />
            ))}
        </ol>
      </div>
    );
  }
}
