import React from "react";
import { Mutation, MutationFn, MutationProps } from "react-apollo";

import { RenameFile, RenameFileVariables } from "../gql-types/RenameFile";

import { RENAME_MUTATION } from "../gql-def/RenameMutation";

// TODO: this should codegen too (doesn't look like apollo-cli codegens for react-apollo though)

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

class RenameMutationInner extends Mutation<RenameFile, RenameFileVariables> {}

type RenameMutationProps = Without<
  MutationProps<RenameFile, RenameFileVariables>,
  "mutation"
>;

export const RenameMutation: React.FC<RenameMutationProps> = props => (
  <RenameMutationInner {...props} mutation={RENAME_MUTATION} />
);

export type RenameMutationFn = MutationFn<RenameFile, RenameFileVariables>;
