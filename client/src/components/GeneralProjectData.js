import React from "react";
import { Link } from "react-router-dom";

export const GeneralProjectData = props => {
  return (
    <div>
      <h2 className="text-warning">{props.project.projectName}</h2>
      <p>{props.project.description}</p>
      <p>
        Repository link:{" "}
        <a href={props.project.repositoryLink} target="blanc">
          {props.project.repositoryLink}
        </a>
      </p>
      <p>Members:</p>
      <ul>
        {props.members &&
          props.members.map((item, i) => (
            <li key={i}>
              {item.firstName} {item.lastName} - {item.email}
            </li>
          ))}
      </ul>
      <Link to="/" className="btn btn-secondary ml-2">
        Back Home
      </Link>
    </div>
  );
};
