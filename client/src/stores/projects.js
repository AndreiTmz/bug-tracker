import axios from "axios";

class ProjectStore {
  constructor() {
    this.projects = [];
    this.error = "";
    this.response = "";
    this.project = undefined;
    this.members = [];
    this.testers = [];
  }

  async getAllProjects() {
    try {
      const res = await axios.get("/bug-tracker-api/allprojects");
      this.projects = res.data;
    } catch (err) {
      console.log(err);
    }
  }

  async addProject(projectName, repositoryLink, description) {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify({ projectName, repositoryLink, description });

    try {
      const res = await axios.post(
        "/bug-tracker-api/users/projects",
        body,
        config
      );
      alert(res.data.message);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async getProject(id) {
    try {
      const res = await axios.get(`/bug-tracker-api/users/projects/${id}`);
      this.project = res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async deleteProject(id) {
    try {
      await axios.delete(`/bug-tracker-api/users/projects/${id}`);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async addTester(id) {
    try {
      await axios.get(`/bug-tracker-api/users/projects/${id}/add-tester`);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async removeTester(id) {
    try {
      await axios.get(`/bug-tracker-api/users/projects/${id}/remove-tester`);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async getMembers(id) {
    try {
      const res = await axios.get(
        `/bug-tracker-api/projects/${id}/members?access=mp`
      );
      this.members = res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async getTesters(id) {
    try {
      const res = await axios.get(
        `/bug-tracker-api/projects/${id}/members?access=tst`
      );
      this.testers = res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }
}

export default ProjectStore;
