import axios from "axios";

class BugStore {
  constructor() {
    this.bugs = [];
    this.error = "";
  }

  async getBugs(id) {
    try {
      const res = await axios.get(`/bug-tracker-api/projects/${id}/bugs`);
      this.bugs = res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async addBug(
    id,
    name,
    commitLink,
    severity,
    priority,
    submittedBy,
    assignedTo,
    solutionLink,
    status
  ) {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const body = JSON.stringify({
      name,
      commitLink,
      severity,
      priority,
      submittedBy,
      assignedTo,
      solutionLink,
      status
    });

    try {
      const res = await axios.post(
        `/bug-tracker-api/projects/${id}/bugs`,
        body,
        config
      );
      await this.getBugs(id);
      alert(res.data.message);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async deleteBug(id, bid) {
    try {
      const res = await axios.delete(
        `/bug-tracker-api/projects/${id}/bugs/${bid}`
      );
      await this.getBugs(id);
      alert(res.data.message);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }

  async updateBug(id, bid, updates) {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const body = JSON.stringify(updates);

    try {
      const res = await axios.put(
        `/bug-tracker-api/projects/${id}/bugs/${bid}`,
        body,
        config
      );
      await this.getBugs(id);
      alert(res.data.message);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        this.error = err.response.data.message;
      }
    }
  }
}

export default BugStore;
