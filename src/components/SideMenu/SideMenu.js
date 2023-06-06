import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import "../SideMenu/SideMenu.css"; // Create this file for custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle, FaUsers, FaShoppingCart } from "react-icons/fa";
import TopBar from "../TopBar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

const SideMenu = () => {
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();

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

  return (
    <Container fluid className="noPadding">
      {location.pathname != "/login" && (
        <TopBar onToggleMenu={() => setMenuVisible(!menuVisible)} />
      )}
      <div ref={menuRef} className={`side-menu${menuVisible ? " open" : ""}`}>
        <ul className="menu-list">
          <li>
            <a href="#customer">
              <FaUsers size={18} className="menu-icon" />
              Customer
            </a>
          </li>
          <li>
            <a href="#user">
              <FaUserCircle size={18} className="menu-icon" />
              User
            </a>
          </li>
          <li>
            <a href="#orders">
              <FaShoppingCart size={18} className="menu-icon" />
              Orders
            </a>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default SideMenu;
