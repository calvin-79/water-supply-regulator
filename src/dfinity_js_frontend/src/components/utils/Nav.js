import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 mt-4 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky">
        <ul className="nav gap-3 fs-3 flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Homes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/supplies">
              Supplies
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/complaints">
              Complaints
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
