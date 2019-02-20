/**
 * Returns the path to the directory that contains the provided file path.
 * Includes trailing '/'.
 */
export const getDirPathFromFilePath = (filePath: string): string =>
  (
    "/" +
    filePath
      .split("/")
      .filter(token => !!token)
      .slice(0, -1)
      .join("/") +
    "/"
  ).replace("//", "/");
