import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import dirname from "path-dirname";

// NOTE: FileRevision must include id, server_modified, and temporaryDownloadLink to avoid underfetching since they are new.
//       it is okay to underfetch FileEntry because it does not create a new object in the cache but overwrites an existing object
//       (though note that it might result in an object that has conflicting data).
const RENAME_MUTATION = gql`
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

/**
 * Filename rename input. Sends rename request to server on Enter keypress.
 */
export const Rename = ({ fromPath }) => (
  <span className="rename">
    <Mutation mutation={RENAME_MUTATION}>
      {renameFn => (
        <input
          placeholder="Rename..."
          onKeyPress={evt => handleKeyPress(evt, fromPath, renameFn)}
        />
      )}
    </Mutation>
  </span>
);

const handleKeyPress = async (evt, fromPath, renameFn) => {
  // Ignore everything but Enter key
  if (evt.key !== "Enter") {
    return;
  }

  const toFilename = evt.currentTarget.value;
  // Ignore empty file name
  if (!toFilename) {
    return;
  }

  const toPath = `${dirname(fromPath)}${toFilename}`;
  const result = await renameFn({ variables: { fromPath, toPath } });
  console.log("result", result);
};
