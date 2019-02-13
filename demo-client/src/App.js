import React, { Component } from "react";
import "./App.css";
import { FolderRevisionsWithData } from "./FolderRevisions";

class App extends Component {
  render() {
    return (
      <div className="App">
        <FolderRevisionsWithData />

        {/* Uncomment below to render a subfolder */}
        {/* 
        <hr />
        <FolderRevisionsWithData path="/pdfs" />
        */}

        {/* Loading from root again to see if it triggers additional Dropbox API requests -- it shouldn't */}
        {/* 
        <hr />
        <FolderRevisionsWithData />
        */}
      </div>
    );
  }
}

export default App;
