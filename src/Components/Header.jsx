import React from "react";
import "../Styles/Header.css";
import logo from "../Resources/logo.png";

function Header() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="" className="imgLogo" />
      </div>
    </>
  );
}

export default Header;
