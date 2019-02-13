import { Dropbox } from "dropbox";

import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";

import { resolvers } from "./resolvers";

export const createDropboxApolloClient = dropboxAccessToken => {
  // DROPBOX API
  const dropboxClient = new Dropbox({
    accessToken: dropboxAccessToken,
    fetch
  });

  // Create Apollo client
  const dropboxApolloLink = setContext(() => {
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

  return apolloClient;
};
