import React from "react";

import spider from "../spider.svg";
import "../styles/index.css";

const NotFound = () => {
  return (
    <div>
      <div className="notFoundContainer">
        <img className="notFoundImg" src={spider} alt="404" />
        <div>
          <span className="notFoundSpan">404</span>
          <br />
          <span className="notFoundSpan1"> We have crawled everywhere,</span>
          <br />
          <span className="notFoundSpan2">but that seems to be lost.</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
