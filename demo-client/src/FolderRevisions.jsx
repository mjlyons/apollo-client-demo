import React from "react";
import pick from "lodash/pick";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Rename } from "./Rename";

const FILES_LIST_FOLDER_QUERY = gql`
  query FolderRevisions($path: String) {
    filesListFolder(path: $path) @client {
      id
      name
      path_display
      tag
      revisions {
        id
        server_modified
        temporaryDownloadLink
      }
    }
  }
`;

export const FolderRevisionsWithData = ({ path }) => (
  <>
    <h1>{path || "/"}</h1>
    <Query query={FILES_LIST_FOLDER_QUERY} variables={{ path }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `ERROR: ${error.message}`;
        console.log(data.filesListFolder);
        if (!data.filesListFolder) return "empty";
        return <FolderRevisions fileEntries={data.filesListFolder} />;
      }}
    </Query>
  </>
);

const FolderRevisions = ({ fileEntries }) => (
  <div className="folderRevisions">
    {fileEntries.map(fileEntry => (
      <FileEntry key={fileEntry.id} fileEntry={fileEntry} />
    ))}
  </div>
);

const FileEntry = ({ fileEntry }) => (
  <div className="fileEntry">
    <div className="fileName">
      {fileEntry.name}
      {fileEntry.tag === "file" && <Rename fromPath={fileEntry.path_display} />}
    </div>
    <FileRevisions revisions={fileEntry.revisions} />
  </div>
);

const FileRevisions = ({ revisions }) => (
  <div className="fileRevisions">
    {revisions.map(revision => (
      <DownloadLink
        key={revision.id}
        {...pick(revision, ["server_modified", "temporaryDownloadLink"])}
      />
    ))}
  </div>
);

const DownloadLink = ({ server_modified, temporaryDownloadLink }) => (
  <div>
    <a href={temporaryDownloadLink}>{server_modified}</a>
  </div>
);
