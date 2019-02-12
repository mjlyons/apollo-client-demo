import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Dropbox } from "dropbox";
import { DROPBOX_ACCESS_TOKEN } from "./.env.js";

import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import gql from "graphql-tag";

// DROPBOX API
const dropboxClient = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN, fetch });

const resolvers = {
  Query: {
    filesListFolder: async (obj, args, context, info) => {
      const apiResult = await context.dropboxClient.filesListFolder({
        path: ""
      });
      return apiResult.entries.map(entry => ({
        ...entry,
        __typename: "FileEntry"
      }));
    }
  },

  // This describes fields to *ADD IN* to the ones supplied
  FileEntry: {
    FileRevisions: async (fileEntry, args, context, info) => {
      const fileListRevisionsApiResponse = await context.dropboxClient.filesListRevisions(
        { path: fileEntry.id }
      );
      return fileListRevisionsApiResponse.entries.map(entry => ({
        ...entry,
        serverModifiedDt: entry.serverModifiedDt,
        __typename: "FileRevision"
      }));
    }
  },

  FileRevision: {
    temporaryDownloadLink: async (fileRevision, args, context, info) => {
      const temporaryLinkApiResponse = await context.dropboxClient.filesGetTemporaryLink(
        { path: `rev:${fileRevision.rev}` }
      );
      return temporaryLinkApiResponse.link;
    }
  }
};

// Create Apollo client
const dropboxApolloLink = setContext((_, { headers }) => {
  return {
    dropboxClient
  };
});
const cache = new InMemoryCache();
const stateLink = withClientState({ cache, resolvers /*, defaults*/ });

const apolloClient = new ApolloClient({
  link: ApolloLink.from([dropboxApolloLink, stateLink]),
  cache
});

const main = async () => {
  const listResponse = await dropboxClient.filesListFolder({ path: "" });
  console.log("apiClientResponse", listResponse);

  const FILES_LIST_FOLDER_QUERY = gql`
    query {
      filesListFolder @client {
        name
        FileRevisions {
          server_modified
          temporaryDownloadLink
        }
      }
    }
  `;
  const apolloResponse = await apolloClient.query({
    query: FILES_LIST_FOLDER_QUERY
  });
  console.log("apolloResponse", apolloResponse);
  console.log("apolloResponse.data", apolloResponse.data);
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

main();
