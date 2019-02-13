import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { ApolloProvider } from "react-apollo";
import { createDropboxApolloClient } from "./dropbox-apollo";
import { DROPBOX_ACCESS_TOKEN } from "./common-src/.env";

const dropboxApolloClient = createDropboxApolloClient({
  dropboxAccessToken: DROPBOX_ACCESS_TOKEN,
  enableGqlServer: true // Note: @client in query may prevent use of server.
});

ReactDOM.render(
  <ApolloProvider client={dropboxApolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
