import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    """
    Returns information about each file and subfolders in a subfolder. If folder
    is not supplied, root folder is assumed.
    """
    filesListFolder(path: String): [FileEntry!]!
  }

  """
  Describes a file.
  """
  type FileEntry {
    id: ID!
    """
    File or folder name.
    """
    name: String!
    """
    Folders do not have any revisions.
    """
    revisions: [FileRevision!]!
    """
    Defines type of file entry (file, folder)
    """
    tag: String!
  }

  """
  Describes a file at a specific revision.
  """
  type FileRevision {
    id: ID!
    server_modified: String!
    temporaryDownloadLink: String!
  }
`;

export default { typeDefs };
