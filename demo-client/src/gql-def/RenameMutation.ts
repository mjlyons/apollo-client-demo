import gql from "graphql-tag";
// NOTE: FileRevision must include id, server_modified, and temporaryDownloadLink to avoid underfetching since they are new.
//       it is okay to underfetch FileEntry because it does not create a new object in the cache but overwrites an existing object
//       (though note that it might result in an object that has conflicting data).
export const RENAME_MUTATION = gql`
  mutation RenameFile($fromPath: String!, $toPath: String!) {
    filesMove(fromPath: $fromPath, toPath: $toPath) {
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
