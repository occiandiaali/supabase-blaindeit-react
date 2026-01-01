import { useEffect } from "react";
import { Link, NavLink } from "react-router";
import "./Navbar.css";
//import logo from "/src/images/nobg-logo.png";
import appLogo from "/src/images/blindate-logo-nobg.png";

import { supabase } from "../../supabaseClient";

export default function Navbar({ session }) {
  const { user } = session;
  // console.log("Navbar user ", user.user_metadata.username);

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={appLogo}
            alt="blindate"
            width="140"
            height="44"
            className="d-inline-block align-text-top"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {/* <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li> */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/schedule"
              >
                <span
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNavDropdown"
                  aria-expanded="false"
                  aria-controls="navbarNavDropdown"
                >
                  Schedule
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/notifications"
              >
                <span
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNavDropdown"
                  aria-expanded="false"
                  aria-controls="navbarNavDropdown"
                >
                  Notifications
                </span>
              </NavLink>
            </li>
            <li className="nav-item dropdown dropstart">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  width={"20px"}
                  height={"20px"}
                  style={{ borderRadius: "100%" }}
                  // src="https://ionicframework.com/docs/img/demos/avatar.svg"
                  src={
                    user.user_metadata.avatar_url ||
                    "https://picsum.photos/100/100?random=12"
                  }
                  alt={user.user_metadata.username || "user"}
                />
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <span style={{ padding: "8px" }}>
                    Hi, {user.user_metadata.username}
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  {/* <a className="dropdown-item" href="#">
                    Account
                  </a> */}
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "nav-link"
                    }
                    to="/account"
                  >
                    <span
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarNavDropdown"
                      aria-expanded="false"
                      aria-controls="navbarNavDropdown"
                    >
                      Account
                    </span>
                  </NavLink>
                </li>
                <li>
                  {/* <a className="dropdown-item" href="#">
                    Chats
                  </a> */}
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "nav-link"
                    }
                    to="/faqs"
                  >
                    <span
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarNavDropdown"
                      aria-expanded="false"
                      aria-controls="navbarNavDropdown"
                    >
                      FAQs
                    </span>
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <span
                    className="dropdown-item text-muted"
                    role="button"
                    onClick={() => {
                      supabase.auth.signOut();
                      localStorage.removeItem("members");
                    }}
                  >
                    SignOut
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
