import { Dropbox } from "dropbox";

import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { createHttpLink } from "apollo-link-http";

import { resolvers } from "./common-src/resolvers";
import { typeDefs } from "./common-src/schema";

export const createDropboxApolloClient = ({
  dropboxAccessToken,
  enableGqlServer
}) => {
  // DROPBOX API
  const dropboxAPI = new Dropbox({
    accessToken: dropboxAccessToken,
    fetch
  });

  // Create Apollo client
  const dropboxApolloLink = setContext(() => {
    return {
      dataSources: { dropboxAPI }
    };
  });
  const cache = new InMemoryCache();
  const stateLink = withClientState({ cache, resolvers, typeDefs });
  console.log("typeDefs", typeDefs);

  const apolloLinks = [dropboxApolloLink, stateLink];

  if (enableGqlServer) {
    apolloLinks.push(createHttpLink({ uri: "http://localhost:4000" }));
  }

  const apolloClient = new ApolloClient({
    link: ApolloLink.from(apolloLinks),
    cache
  });

  return apolloClient;
};
