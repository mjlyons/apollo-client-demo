import React, { Component } from "react";
import "./App.css";
import { FolderRevisionsWithData } from "./FolderRevisions";

class App extends Component {
  render() {
    return (
      <div className="App">
        <FolderRevisionsWithData />
        <hr />
        <FolderRevisionsWithData path="/pdfs" />

        {/* Loading from root again to see if it triggers additional APIv2 requests -- it shouldn't */}
        <hr />
        <FolderRevisionsWithData />
      </div>
    );
  }
}

export default App;
