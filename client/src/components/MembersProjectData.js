import React from "react";
import BugStore from "../stores/bugs";

export default class MembersProjectData extends React.Component {
  constructor() {
    super();
    this.bstore = new BugStore();
  }

  render() {
    return (
      <div>
        <hr />
        <p>Testers for this project: {this.props.testers.length}</p>
        <ul>
          {this.props.testers.length !== 0 &&
            this.props.testers.map((item, index) => (
              <li key={index}>
                {item.firstName} {item.lastName} - {item.email}
              </li>
            ))}
        </ul>
        <hr />
        <p>{this.props.bugs.length} bug(s) submitted</p>
        <ol>
          {this.props.bugs.length !== 0 &&
            this.props.bugs.map((item, index) => (
              <li key={item.commitLink + index}>
                <p>
                  {item.name} -{" "}
                  <a href={item.commitLink} target="blanc">
                    {item.commitLink}
                  </a>
                  <span> (by {item.submittedBy})</span>
                </p>
                <p>
                  Severity: {item.severity} / Priority: {item.priority}
                </p>
                {item.status === "assigned" ? (
                  <div>
                    {item.assignedTo !== localStorage.email ? (
                      <p>Assigned to {item.assignedTo}</p>
                    ) : (
                      <div>
                        <p> Assigned to you</p>
                        <form
                          onSubmit={() =>
                            this.bstore.updateBug(localStorage.id, item.id, {
                              assignedTo: "",
                              status: "unassigned"
                            })
                          }
                        >
                          <button type="submit" className="btn btn-danger">
                            Give up
                          </button>
                        </form>
                        <form
                          onSubmit={e =>
                            this.bstore.updateBug(localStorage.id, item.id, {
                              status: "resolved",
                              solutionLink: e.target.elements.resolveLink.value
                            })
                          }
                        >
                          <div className="input-group my-3">
                            <input
                              type="url"
                              name="resolveLink"
                              placeholder="Resolve Link"
                              className="form-control"
                              required
                            />
                            <div className="input-group-append">
                              <button type="submit" className="btn btn-success">
                                Submit solution
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {item.status === "resolved" ? (
                      <p>
                        Resolved -{" "}
                        <a href={item.solutionLink} target="blanc">
                          {item.solutionLink}
                        </a>
                      </p>
                    ) : (
                      <div>
                        <p>Not Assigned</p>
                        <form
                          onSubmit={() => {
                            this.bstore.updateBug(localStorage.id, item.id, {
                              assignedTo: localStorage.email,
                              status: "assigned"
                            });
                          }}
                        >
                          <button type="submit" className="btn btn-success">
                            Assign to me
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
        </ol>
      </div>
    );
  }
}
