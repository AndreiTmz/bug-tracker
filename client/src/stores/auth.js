import axios from "axios";
import setAuthToken from "./setAuthToken";

class UserStore {
  constructor() {
    this.token = "";
    this.user = undefined;
    this.error = "";
    this.users = [];
  }

  async loadUser() {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("/bug-tracker-api/users");
      this.user = res.data;
    } catch (err) {
      this.error = err.response.data.message;
    }
  }

  async allUsers() {
    try {
      const res = await axios.get("/bug-tracker-api/allusers");
      this.users = res.data;
    } catch (error) {
      this.error = error.response.data.message;
    }
  }

  async login(email, password) {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post(
        "/bug-tracker-api/users/login",
        body,
        config
      );
      this.token = res.data.token;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      this.loadUser();
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async register(firstName, lastName, email, password) {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify({ firstName, lastName, email, password });

    try {
      const res = await axios.post(
        "bug-tracker-api/users/register",
        body,
        config
      );
      localStorage.setItem("token", res.data.token);
      alert("Account Created");
    } catch (err) {
      localStorage.removeItem("token");
      this.error = err.response.data.message;
    }
  }

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    this.user = undefined;
  }
}

export default UserStore;
