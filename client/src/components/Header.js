import React from "react";
import { Link } from "react-router-dom";

const Header = props => (
  <header>
    <div className="container">
      <div className="row">
        <div className="col-sm text-center banner my-2">
          <h1 className="text-capitalize text-primary">
            welcome to <strong className="banner-title">Bug Tracker</strong>
          </h1>
          <div className="my-5">
            {props.loggedEmail ? (
              <div className="text-capitalize">
                <button
                  type="button"
                  className="btn btn-danger mx-2"
                  onClick={props.logout}
                >
                  <Link className="text-white" to="/">
                    {" "}
                    Log Out{" "}
                  </Link>
                </button>
                <span className="text-dark">{props.loggedEmail}</span>
              </div>
            ) : (
              <div className="text-capitalize">
                <button className="btn btn-success mx-2">
                  {" "}
                  <Link className="text-white" to="/login">
                    Log In
                  </Link>
                </button>
                <button className="btn btn-success">
                  <Link className="text-white" to="/register">
                    New Account
                  </Link>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
