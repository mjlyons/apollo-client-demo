import React from "react";
import pick from "lodash/pick";
import { FolderRevisionsQuery } from "./gql-react/FolderRevisions";
import { Rename } from "./Rename";

export const FolderRevisionsWithData: React.SFC<{
  path?: string;
}> = props => (
  <>
    <h1>{props.path || "/"}</h1>
    <FolderRevisionsQuery variables={{ path: props.path }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `ERROR: ${error.message}`;
        return !!data ? (
          <FolderRevisions fileEntries={data.filesListFolder} />
        ) : (
          "No data"
        );
      }}
    </FolderRevisionsQuery>
  </>
);

/**
 * Data needed to render a revision of a file.
 */
interface IFileRevisionData {
  id: string;
  server_modified: string;
  temporaryDownloadLink: string;
}

/**
 * Data needed to render all revisions of a file.
 */
interface IFileEntryData {
  id: string;
  name: string;
  revisions: IFileRevisionData[];
  tag: string;
  path_display: string;
}

interface IFolderRevisionsProps {
  fileEntries: IFileEntryData[];
}
/**
 * Renders information about each file in a folder.
 */
const FolderRevisions: React.SFC<IFolderRevisionsProps> = props => (
  <div className="folderRevisions">
    {props.fileEntries.map(fileEntry => (
      <FileEntry key={fileEntry.id} fileEntry={fileEntry} />
    ))}
  </div>
);

interface IFileEntryProps {
  fileEntry: IFileEntryData;
}
/**
 * Renders information about a file and its revisions.
 */
const FileEntry: React.SFC<IFileEntryProps> = props => (
  <div className="fileEntry">
    <div className="fileName">
      {props.fileEntry.name}
      {props.fileEntry.tag === "file" && (
        <Rename fromPath={props.fileEntry.path_display} />
      )}
    </div>
    <FileRevisions revisions={props.fileEntry.revisions} />
  </div>
);

interface IFileRevisionsProps {
  revisions: IFileRevisionData[];
}
/**
 * Renders information about a set of revisions for a file.
 */
const FileRevisions: React.SFC<IFileRevisionsProps> = props => (
  <div className="fileRevisions">
    {props.revisions.map(revision => (
      <DownloadLink
        key={revision.id}
        {...pick(revision, ["server_modified", "temporaryDownloadLink"])}
      />
    ))}
  </div>
);

interface IDownloadLinkProps {
  server_modified: string;
  temporaryDownloadLink: string;
}
/**
 * Renders revision date link that downloads revision when clicked.
 */
const DownloadLink: React.SFC<IDownloadLinkProps> = props => (
  <div>
    <a href={props.temporaryDownloadLink}>{props.server_modified}</a>
  </div>
);

React.Component;
