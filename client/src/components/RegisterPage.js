import React from "react";
import { Redirect } from "react-router-dom";
import UserStore from "../stores/auth";

export default class RegisterPage extends React.Component {
  constructor() {
    super();
    this.store = new UserStore();
    this.state = {
      error: undefined,
      redirect: false
    };
  }

  componentDidMount() {
    this.store.allUsers();
  }

  handleSubmitNewAccount = e => {
    e.preventDefault();

    let error = "";
    const firstName = e.target.elements.firstName.value;
    const lastName = e.target.elements.lastName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const confirmPassword = e.target.elements.confirmPassword.value;
    const re = /\S+@\S+\.\S+/;

    if (firstName === "") {
      error = "Add your first name";
    } else if (lastName === "") {
      error = "Add your last name";
    } else if (email === "") {
      error = "Add your email";
    } else if (!re.test(email)) {
      error = "The email adress is not valid";
    } else if (password === "") {
      error = "Add a password";
    } else if (password !== confirmPassword) {
      error = "Passwords don't match";
    } else {
      var found;
      this.store.users.forEach((user, index) => {
        if (email === user.email) {
          found = index;
        }
      });
      if (found !== undefined) {
        error = "Existent user";
      }
    }
    this.setState(() => ({ error }));
    if (!error) {
      this.setState(() => ({ redirect: true }));
      this.store.register(firstName, lastName, email, password);
    }
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  render() {
    return (
      <div>
        <div className="col-sm-10 col-md-8 col-lg-6 mx-auto my-3 signup-form">
          <div className="card card-body bg-secondary">
            <div className="card-title text-center text-white">
              <h2 className="text-capitalize">Please register!</h2>
            </div>
            {this.state.error && (
              <p className="py-2 text-danger">{this.state.error}</p>
            )}
            <form onSubmit={this.handleSubmitNewAccount}>
              <div className="form-group mt-3">
                <input
                  type="text"
                  name="firstName"
                  className="form-control form-control-lg"
                  placeholder="First Name"
                />
              </div>
              <div className="form-group mt-3">
                <input
                  type="text"
                  name="lastName"
                  className="form-control form-control-lg"
                  placeholder="Last Name"
                />
              </div>
              <div className="form-group mt-3">
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Email"
                />
              </div>
              <div className="form-group mt-3">
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                />
              </div>
              <div className="form-group mt-3">
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-lg"
                  placeholder="Confirm Password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-dark btn-block text-uppercase"
              >
                Sign up
              </button>
              {this.renderRedirect()}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
