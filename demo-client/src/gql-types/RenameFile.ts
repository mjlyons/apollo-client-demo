/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RenameFile
// ====================================================

export interface RenameFile_filesMove_revisions {
  __typename: "FileRevision";
  id: string;
  server_modified: string;
  temporaryDownloadLink: string;
}

export interface RenameFile_filesMove {
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
  revisions: RenameFile_filesMove_revisions[];
}

export interface RenameFile {
  /**
   * Moves an existing file.
   * Returns resulting FileEntry if operation succeeded.
   */
  filesMove: RenameFile_filesMove | null;
}

export interface RenameFileVariables {
  fromPath: string;
  toPath: string;
}
