import React from "react";
import { Redirect } from "react-router-dom";
import UserStore from "../stores/auth";

export default class LoginPage extends React.Component {
  constructor() {
    super();
    this.store = new UserStore();
    this.state = {
      error: undefined,
      redirect: localStorage.token,
      loading: true
    };
  }

  componentDidMount() {
    this.store.allUsers();
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  }

  handleSubmitLogIn = e => {
    e.preventDefault();
    let error = "";
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const re = /\S+@\S+\.\S+/;
    if (email === "") {
      error = "Add a valid email adress";
    } else if (!re.test(email)) {
      error = "The email adress is not valid";
    } else if (password === "") {
      error = "Enter your password";
    } else {
      var found;
      this.store.users.forEach((user, index) => {
        if (email === user.email) {
          found = index;
        }
      });
      if (found === undefined) {
        error = "Invalid credentials";
      } else {
        if (password !== this.store.users[found].password) {
          error = "Invalid credentials";
        }
      }
    }
    this.setState(() => ({ error }));
    if (!error) {
      this.props.login(email);
      this.setState(() => ({ redirect: true }));
      this.store.login(email, password);
    }
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          " "
        ) : (
          <div className="col-sm-10 col-md-6 col-lg-6 mx-auto my-3 signup-form">
            <div className="card card-body bg-secondary">
              <div className="card-title text-center text-white">
                <h2 className="text-capitalize">Please log in first!</h2>
              </div>
              {this.state.error && (
                <p className="py-2 text-danger">{this.state.error}</p>
              )}
              <form onSubmit={this.handleSubmitLogIn}>
                <div className="form-group mt-3">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                  />
                </div>
                <div className="form-group mt-3">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-dark btn-block text-uppercase"
                >
                  Sign in
                </button>
                {this.renderRedirect()}
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
