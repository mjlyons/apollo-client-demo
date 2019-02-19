import React from "react";
import { Query, QueryProps } from "react-apollo";

import {
  FolderRevisions,
  FolderRevisionsVariables
} from "../gql-types/FolderRevisions";

import { FILES_LIST_FOLDER_QUERY } from "../gql-def/FolderRevisions";

// TODO: this should codegen too (doesn't look like apollo-cli codegens for react-apollo though)

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

class FolderRevisionsQueryInner extends Query<
  FolderRevisions,
  FolderRevisionsVariables
> {}

type FolderRevisionsQueryProps = Without<
  QueryProps<FolderRevisions, FolderRevisionsVariables>,
  "query"
>;

export const FolderRevisionsQuery: React.FC<
  FolderRevisionsQueryProps
> = props => (
  <FolderRevisionsQueryInner {...props} query={FILES_LIST_FOLDER_QUERY} />
);
