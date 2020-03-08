import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faUser, faTrashAlt);
const MemberEmailInput = props => (
  <>
    <div className="input-group my-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          <FontAwesomeIcon icon="user" className="text-primary" />
        </span>
      </div>
      <input
        type="email"
        key={props.id}
        id={props.id}
        className="form-control form-control-lg"
        placeholder={`Member Email ${props.count}`}
      />
      <div className="input-group-append">
        <button
          type="button"
          className="btn btn-danger"
          onClick={e => {
            props.handleDeleteInput(props.id);
          }}
        >
          remove
        </button>
      </div>
    </div>
  </>
);

export default MemberEmailInput;
