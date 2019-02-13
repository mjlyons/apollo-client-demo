# apollo-client-demo

Proof of concept for a GraphQL wrapper around existing REST API (in this case, Dropbox). GraphQL queries are decomposed into corresponding REST API requests.

The GraphQL-to-REST-API decomposition can happen:

1. Purely on the client in the browser (without need for a GraphQL server)
2. Purely on the server (as one GraphQL request)
3. As a mix of the two _for the same query_ (executing some resolvers on the server and the rest on the client)

This approach reuses the same resolver code on the client and server. You don't need to implement the GraphQL-to-REST-API decomposition logic twice.

You can also use feature gating to extend #3 to gradually transition use of a GraphQL resolver from the client to server.

More on both of these use cases toward the end of the README.

## Tooling

This example uses:

- `apollo-client` to run all GraphQL queries in the web client
- `apollo-link-state` to run resolvers locally in the client
- `apollo-server` to run the GraphQL server
- `react` and `react-apollo` to render UX on the web client
- `dropbox` to run Dropbox REST API calls

## Example schema

This POC wraps three Dropbox API calls in a GraphQL schema. It's not intended to be a full GraphQL implementation of the Dropbox API:

__common-src/schema.mjs:__
```
type Query {
  filesListFolder(path: String): [FileEntry!]!
}

type FileEntry {
  id: ID!
  name: String!
  revisions: [FileRevision!]!
  tag: String!
}

type FileRevision {
  id: ID!
  server_modified: String!
  temporaryDownloadLink: String!
}
```

- The `filesListFolder` resolver wraps Dropbox's [/files/list_folder](https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder) REST endpoint
- The `FileEntry.revisions` resolver wraps Dropbox's [/files/list_revisions](https://www.dropbox.com/developers/documentation/http/documentation#files-list_revisions) REST endpoint
- The `FileRevision.temporaryDownloadLink` resolver wraps Dropbox's [/files/get_temporary_link](https://www.dropbox.com/developers/documentation/http/documentation#files-get_temporary_link) REST endpoint

To get a temporary download link for every revision of a file in `path`, use this GraphQL query:

__demo_client/src/FolderRevisions.jsx__:
```
  query FolderRevisions($path: String) {
    filesListFolder(path: $path) {
      id
      name
      tag
      revisions {
        id
        server_modified
        temporaryDownloadLink
      }
    }
  }
```

## Installation

_Warning_: this is a proof of concept and is not meant for production. Anyone with access to your
source code, the web client, or GraphQL server will have full read & write access to the
/Apps/ApolloClientDemo folder in your Dropbox!

__Clone this repo:__
```
git clone https://github.com/mjlyons/apollo-client-demo.git && cd apollo-client-demo
```

__Configure your Dropbox App:__

- Create the Dropbox app
  * Go to https://www.dropbox.com/developers/apps/create
  * Select "Dropbox API" (not "Dropbox Business API")
  * Choose "App folder" access (this will limit access to /Apps/ApolloClientDemo in your Dropbox)
  * If you have a Personal and Work Dropbox, pick one.
  * Click the "Create app" button

- Get a Dropbox access token
  * In your app settings, find the "OAuth2 section"
  * Look for the "Generated access token" settings
  * Click the "Generate" button
  * Store the resulting token by creating `common-src/.env.mjs`:

  ```
  // Replace the Dropbox access token below
  export const DROPBOX_ACCESS_TOKEN =
    "x_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxx";

  export default { DROPBOX_ACCESS_TOKEN };

  ```

- Put some files in your Dropbox's /Apps/ApolloClientDemo folder
  * Store a few files using https://www.dropbox.com or Dropbox's desktop client.
  * Save changes to the files and overwrite the originals (to create multiple file revisions)

__Set up the client:__
```
cd demo-client
yarn install
yarn start
```

This will open the web client in your browser. You should see an entry for each file in the /Apps/ApolloClientDemo folder. Each file will have a timestamp for each revision, and clicking the timestamp will download that revision of the file.

__Set up the server (optional):__
You only need to set the server up if you want to run some or all of your query outside of the client (options 2 & 3 at start of README).
```
cd ../demo-server
yarn install
yarn start
```

This will run the GraphQL server on http://localhost:4000 and includes GraphQL Playground.

You should be able to visit [http://localhost:4000](http://localhost:4000) and run the following query:

```
  query FolderRevisions {
    filesListFolder {
      id
      name
      tag
      revisions {
        id
        server_modified
        temporaryDownloadLink
      }
    }
  }
```

This should return the same data rendered in the client install instructions.

## What's cool

### Running without a GraphQL server

By default, the web client will translate the GraphQL query locally and make Dropbox REST API requests.
It does not use the GraphQL server. Stop running the server and try loading the page. It still loads.

Let's check what Dropbox REST API requests are sent by the client. In Chrome, open the "network" tab and refresh the page. You should see the Dropbox API requests `list_folder`, `list_revisions`, and `get_temporary_link`. If you installed Apollo Dev Tools, you may see `graphql`
requests which are unrelated to the what's powering the web client UX.

### REST API request parallelism

In the "network" tab, find the Waterfall toward the right. You might need to make your browser window wider
to see it. You'll notice that the Dropbox REST API calls are parallelizing. As soon as the `list_folder` call returns with the list of files, `list_revisions` is called for each file simultaneously. This happens again when the `list_revisions` calls return and `get_tempoprary_link` is sent for each revision.

### Using Apollo Client Devtools without a GraphQL server

First, make sure you've installed [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) in Chrome. Then switch to the "Apollo" tab  and click the "Queries" icon. You should see the FolderRevisions GraphQL query powering the UX. Click the "Cache" icon next. You should see cached entries for the root query, each FileEntry (represents a file) and each FileRevision (represents a revision of a file).

### REST API response caching

Let's see what happens if we try to reload the same data from the GraphQL query by the folder contents twice.

In __demo-client/src/App.js__, find this block of code:

```
{/* Loading from root again to see if it triggers additional Dropbox API requests -- it shouldn't */}
{/* 
<hr />
<FolderRevisionsWithData />
*/}
```

and uncomment it to look like this:

```
{/* Loading from root again to see if it triggers additional Dropbox API requests -- it shouldn't */}
<hr />
<FolderRevisionsWithData />
```

When you save and reload, you'll see the contents of the folder twice. However, there are no additional network requests in the "network" tab. Apollo Client is correctly caching the responses and
preventing unnecessary network requests.

### Switching to the GraphQL server

Translating the GraphQL query to REST API requests on the client has a downside: you need to make multiple round trips to load your data. Switching to the GraphQL server will shrink the client's network roundtrips down to one request. 

To switch to the GraphQL server, start the server and remove the `@client` directive from the GraphQL query.

In __demo-client/src/FolderRevisions.jsx__ find the query:

```
const FILES_LIST_FOLDER_QUERY = gql`
  query FolderRevisions($path: String) {
    filesListFolder(path: $path) @client {
      id
      name
      tag
      revisions {
        id
        server_modified
        temporaryDownloadLink
      }
    }
  }
`;
```

and remove the `@client` directive like so:

```
const FILES_LIST_FOLDER_QUERY = gql`
  query FolderRevisions($path: String) {
    filesListFolder(path: $path) {
      id
      name
      tag
      revisions {
        id
        server_modified
        temporaryDownloadLink
      }
    }
  }
`;
```

The `@client` tells Apollo Client to resolve the GraphQL client locally. Removing it causes Apollo Client to send the query to the GraphQL server.

After saving and reloading, look at Chrome's "network" tab. You should notice a new request to `http://localhost:4000`. You can see the GraphQL query in the request body and the full result in the response.


### Running part of the query on the GraphQL server (gradual rollout)

Let's say you wanted the `filesListFolder` query to run on the GraphQL server, but the "revisions" and "temporaryDownloadLink" to be translated locally. You might want to do this if you were confident that the filesListFolder part of your schema was set but didn't want to lock in the other two yet.

You can do this by changing where you position the `@client` directive in your query. Anything inside the `@client` block will be run locally on the client; everything else will go to the GraphQL server.

For the case above, you would rewrite your query as:

```
const FILES_LIST_FOLDER_QUERY = gql`
  query FolderRevisions($path: String) {
    filesListFolder(path: $path) {
      id
      name
      tag
      revisions @client {
        id
        server_modified
        temporaryDownloadLink
      }
    }
  }
`;
```

If you save this change, reload, and watch the "network" tab, you'll notice the graphql query to http://localhost:4000 only includes the following:

```
query FolderRevisions($path: String) {
  filesListFolder(path: $path) {
    id
    name
    tag
    __typename
  }
}
```

You'll also see the client is making `list_revisions` and `get_temporary_link` REST API calls again.


### Gradually ramping up traffic to your GraphQL server

You could extend the "gradual rolllout" approach to ramp up traffic to a specific resolver rather than switching from 0% to 100%. Using feature gating, you'd start by removing the @client directive for a small percentage of clients. As you feel more comfortable sending additional traffic to the server's resolver you would adjust the feature gate to remove the @client directive for more clients. Eventually you'll be out to 100% and fully rolled out.

### Reusing the same resolver code on client and server

The code to decompose GraphQL into REST API calls is shared between client & server in `common-src/resolvers.mjs`. You don't need to do write any new code to move parts of your GraphQL schema from the client to a GraphQL server.
