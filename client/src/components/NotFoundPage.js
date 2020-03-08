import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="container">
    <div className="row">
      <div className="col mx-auto text-center">
        <h2>404</h2>
        <h2>
          Page Not Found - <Link to="/">Go home</Link>
        </h2>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
