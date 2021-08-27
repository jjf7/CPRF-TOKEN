import React from "react";
import logo from './CoinpinverVertical-White.png'

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src={logo}
            alt=""
            width="100"
            height="84"
            className="d-inline-block align-text-top"
          />
          CoinPinverPhoenix -  CPRP [TOKEN]
        </a>
      </div>
    </nav>
  );
}
