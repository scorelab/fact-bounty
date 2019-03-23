import React, { Component } from "react";
import { Route } from "react-router-dom";
import Posts from "./Posts";
import About from "../../about/About";

class MainLayout extends Component {
  render() {
    return (
      <div style={{ paddingTop: "74px" }}>
        <Route exact path={"/"} component={Posts} />
        <Route path="/about" component={About} />
      </div>
    );
  }
}

export default MainLayout;
