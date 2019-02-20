import React from "react";
import { getDirPathFromFilePath } from "./fileutils";
import { RenameMutation, RenameMutationFn } from "./gql-react/RenameMutation";

/**
 * Filename rename input. Sends rename request to server on Enter keypress.
 */
export const Rename: React.SFC<{ fromPath: string }> = ({ fromPath }) => (
  <span className="rename">
    <RenameMutation>
      {renameFn => (
        <input
          placeholder="Rename..."
          onKeyPress={evt => handleKeyPress(evt, fromPath, renameFn)}
        />
      )}
    </RenameMutation>
  </span>
);

/**
 * Handles "enter" keypress to trigger filerename.
 * @param evt Keypress event
 * @param fromPath Filepath of file before rename
 * @param renameFn Rename mutation function
 */
const handleKeyPress = async (
  evt: React.KeyboardEvent<HTMLInputElement>,
  fromPath: string,
  renameFn: RenameMutationFn
) => {
  // Ignore everything but Enter key
  if (evt.key !== "Enter") {
    return;
  }

  const toFilename = evt.currentTarget.value;
  // Ignore empty file name
  if (!toFilename) {
    return;
  }

  const toPath = `${getDirPathFromFilePath(fromPath)}${toFilename}`;
  const result = await renameFn({ variables: { fromPath, toPath } });
  console.log("result", result);
};
