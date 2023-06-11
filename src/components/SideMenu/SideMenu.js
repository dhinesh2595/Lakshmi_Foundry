import React, { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import "../SideMenu/SideMenu.css"; // Create this file for custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle, FaUsers, FaShoppingCart,FaSignOutAlt } from "react-icons/fa";
import TopBar from "../TopBar";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SideMenu = () => {
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();
  const history = useHistory()
  const [error, setError] = useState("")

  useEffect(() => {
    // Add event listener to detect clicks outside the menu
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    // Close the menu if the click is outside the menu area
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  async function handleLogout() {
    setError("")

    try {
      setMenuVisible(!menuVisible);
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <Container fluid className="noPadding">
      {location.pathname !== "/login" && (
        <TopBar onToggleMenu={toggleMenu} />
      )}
      <div ref={menuRef} className={`side-menu${menuVisible ? " open" : ""}`}>
        <ul className="menu-list">
          <li>
            <Link to="/customers">
              <FaUsers size={18} className="menu-icon" />
              Customer
            </Link>
          </li>
          <li>
            <Link to="/users">
              <FaUserCircle size={18} className="menu-icon" />
              User
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <FaShoppingCart size={18} className="menu-icon" />
              Orders
            </Link>
          </li>
          <li>
          <Link to="/#" onClick={handleLogout}>
              <FaSignOutAlt size={18} className="menu-icon" />
              Sign out
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default SideMenu;
