import React from "react";
import BugStore from "../stores/bugs";

export default class Bug extends React.Component {
  constructor() {
    super();
    this.bstore = new BugStore();
    this.state = {
      reload: false
    };
  }
  render() {
    return (
      <div>
        <p>
          {this.props.bug.name} -{" "}
          <a href={this.props.bug.commitLink} target="blanc">
            {this.props.bug.commitLink}
          </a>
          <span> (by {this.props.bug.submittedBy})</span>
        </p>
        <p>
          Severity: {this.props.bug.severity} / Priority:{" "}
          {this.props.bug.priority}
        </p>
        {this.props.bug.submittedBy === localStorage.email && (
          <form
            onSubmit={() => {
              this.bstore.deleteBug(localStorage.id, this.props.bug.id);
            }}
          >
            <button type="submit" className="btn btn-danger m-2">
              Stergere
            </button>
          </form>
        )}
      </div>
    );
  }
}
