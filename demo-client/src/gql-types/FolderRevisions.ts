/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FolderRevisions
// ====================================================

export interface FolderRevisions_filesListFolder_revisions {
  __typename: "FileRevision";
  id: string;
  server_modified: string;
  temporaryDownloadLink: string;
}

export interface FolderRevisions_filesListFolder {
  __typename: "FileEntry";
  id: string;
  /**
   * File or folder name.
   */
  name: string;
  /**
   * Fully qualified path of file in user's dropbox.
   */
  path_display: string;
  /**
   * Defines type of file entry (file, folder)
   */
  tag: string;
  /**
   * Folders do not have any revisions.
   */
  revisions: FolderRevisions_filesListFolder_revisions[];
}

export interface FolderRevisions {
  /**
   * Returns information about each file and subfolders in a subfolder. If folder
   * is not supplied, root folder is assumed.
   */
  filesListFolder: FolderRevisions_filesListFolder[];
}

export interface FolderRevisionsVariables {
  path?: string | null;
}
