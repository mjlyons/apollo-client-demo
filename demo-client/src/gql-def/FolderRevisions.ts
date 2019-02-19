import gql from "graphql-tag";

/**
 * Fetches information (download link, last mod dt) for each file in a folder $path.
 */
const FILES_LIST_FOLDER_QUERY = gql`
  query FolderRevisions($path: String) {
    filesListFolder(path: $path) {
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