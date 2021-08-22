import { GraphQLClient } from 'graphql-request';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPlayer: Player;
  updatePlayer?: Maybe<Player>;
  deletePlayer: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  updateOptions?: Maybe<Options>;
  deleteOptions: Scalars['Boolean'];
};


export type MutationCreatePlayerArgs = {
  input: PlayerInput;
};


export type MutationUpdatePlayerArgs = {
  input?: Maybe<UpdatePlayerInput>;
};


export type MutationDeletePlayerArgs = {
  id: Scalars['Float'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationUpdateOptionsArgs = {
  input?: Maybe<OptionsInput>;
};

export type Options = {
  __typename?: 'Options';
  userId: Scalars['ID'];
  rollType: Scalars['String'];
  lockAfterOut: Scalars['Boolean'];
  theme: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type OptionsInput = {
  rollType: Scalars['String'];
  lockAfterOut: Scalars['Boolean'];
  theme: Scalars['String'];
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['Float'];
  user: User;
  name: Scalars['String'];
  tank: Scalars['Boolean'];
  healer: Scalars['Boolean'];
  dps: Scalars['Boolean'];
  locked: Scalars['Boolean'];
  inTheRoll: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type PlayerInput = {
  name: Scalars['String'];
  tank: Scalars['Boolean'];
  healer: Scalars['Boolean'];
  dps: Scalars['Boolean'];
  locked: Scalars['Boolean'];
  inTheRoll: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  players: Array<Player>;
  player?: Maybe<Player>;
  me?: Maybe<User>;
  refreshToken?: Maybe<Scalars['String']>;
  options?: Maybe<Options>;
};


export type QueryPlayerArgs = {
  id: Scalars['Float'];
};

export type UpdatePlayerInput = {
  name: Scalars['String'];
  tank: Scalars['Boolean'];
  healer: Scalars['Boolean'];
  dps: Scalars['Boolean'];
  locked: Scalars['Boolean'];
  inTheRoll: Scalars['Boolean'];
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  players: Array<Player>;
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  token?: Maybe<Scalars['String']>;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: string, username: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', token?: Maybe<string>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: string, username: string }> };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', token?: Maybe<string>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: string, username: string }> } };

export type CreatePlayerMutationVariables = Exact<{
  input: PlayerInput;
}>;


export type CreatePlayerMutation = { __typename?: 'Mutation', createPlayer: { __typename?: 'Player', id: number, name: string, tank: boolean, healer: boolean, dps: boolean, locked: boolean, inTheRoll: boolean } };

export type DeletePlayerMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeletePlayerMutation = { __typename?: 'Mutation', deletePlayer: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', token?: Maybe<string>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: string, username: string }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', token?: Maybe<string>, errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: string, username: string }> } };

export type UpdateOptionsMutationVariables = Exact<{
  input: OptionsInput;
}>;


export type UpdateOptionsMutation = { __typename?: 'Mutation', updateOptions?: Maybe<{ __typename?: 'Options', lockAfterOut: boolean, rollType: string, theme: string }> };

export type UpdatePlayerMutationVariables = Exact<{
  input: UpdatePlayerInput;
}>;


export type UpdatePlayerMutation = { __typename?: 'Mutation', updatePlayer?: Maybe<{ __typename?: 'Player', id: number, name: string, tank: boolean, healer: boolean, dps: boolean, locked: boolean, inTheRoll: boolean }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', id: string, username: string }> };

export type OptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type OptionsQuery = { __typename?: 'Query', options?: Maybe<{ __typename?: 'Options', lockAfterOut: boolean, rollType: string, theme: string }> };

export type PlayerQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type PlayerQuery = { __typename?: 'Query', player?: Maybe<{ __typename?: 'Player', id: number, name: string, tank: boolean, healer: boolean, dps: boolean, inTheRoll: boolean, locked: boolean }> };

export type PlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayersQuery = { __typename?: 'Query', players: Array<{ __typename?: 'Player', id: number, name: string, tank: boolean, healer: boolean, dps: boolean, inTheRoll: boolean, locked: boolean }>, me?: Maybe<{ __typename?: 'User', username: string }> };

export const RegularErrorFragmentDoc = `
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = `
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = `
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
  token
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = `
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export const useChangePasswordMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<ChangePasswordMutation, TError, ChangePasswordMutationVariables, TContext>
    ) => 
    useMutation<ChangePasswordMutation, TError, ChangePasswordMutationVariables, TContext>(
      (variables?: ChangePasswordMutationVariables) => fetcher<ChangePasswordMutation, ChangePasswordMutationVariables>(client, ChangePasswordDocument, variables)(),
      options
    );
export const CreatePlayerDocument = `
    mutation CreatePlayer($input: PlayerInput!) {
  createPlayer(input: $input) {
    id
    name
    tank
    healer
    dps
    locked
    inTheRoll
  }
}
    `;
export const useCreatePlayerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<CreatePlayerMutation, TError, CreatePlayerMutationVariables, TContext>
    ) => 
    useMutation<CreatePlayerMutation, TError, CreatePlayerMutationVariables, TContext>(
      (variables?: CreatePlayerMutationVariables) => fetcher<CreatePlayerMutation, CreatePlayerMutationVariables>(client, CreatePlayerDocument, variables)(),
      options
    );
export const DeletePlayerDocument = `
    mutation DeletePlayer($id: Float!) {
  deletePlayer(id: $id)
}
    `;
export const useDeletePlayerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<DeletePlayerMutation, TError, DeletePlayerMutationVariables, TContext>
    ) => 
    useMutation<DeletePlayerMutation, TError, DeletePlayerMutationVariables, TContext>(
      (variables?: DeletePlayerMutationVariables) => fetcher<DeletePlayerMutation, DeletePlayerMutationVariables>(client, DeletePlayerDocument, variables)(),
      options
    );
export const ForgotPasswordDocument = `
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export const useForgotPasswordMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<ForgotPasswordMutation, TError, ForgotPasswordMutationVariables, TContext>
    ) => 
    useMutation<ForgotPasswordMutation, TError, ForgotPasswordMutationVariables, TContext>(
      (variables?: ForgotPasswordMutationVariables) => fetcher<ForgotPasswordMutation, ForgotPasswordMutationVariables>(client, ForgotPasswordDocument, variables)(),
      options
    );
export const LoginDocument = `
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>
    ) => 
    useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      (variables?: LoginMutationVariables) => fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables)(),
      options
    );
export const LogoutDocument = `
    mutation Logout {
  logout
}
    `;
export const useLogoutMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>
    ) => 
    useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
      (variables?: LogoutMutationVariables) => fetcher<LogoutMutation, LogoutMutationVariables>(client, LogoutDocument, variables)(),
      options
    );
export const RegisterDocument = `
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export const useRegisterMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<RegisterMutation, TError, RegisterMutationVariables, TContext>
    ) => 
    useMutation<RegisterMutation, TError, RegisterMutationVariables, TContext>(
      (variables?: RegisterMutationVariables) => fetcher<RegisterMutation, RegisterMutationVariables>(client, RegisterDocument, variables)(),
      options
    );
export const UpdateOptionsDocument = `
    mutation UpdateOptions($input: OptionsInput!) {
  updateOptions(input: $input) {
    lockAfterOut
    rollType
    theme
  }
}
    `;
export const useUpdateOptionsMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<UpdateOptionsMutation, TError, UpdateOptionsMutationVariables, TContext>
    ) => 
    useMutation<UpdateOptionsMutation, TError, UpdateOptionsMutationVariables, TContext>(
      (variables?: UpdateOptionsMutationVariables) => fetcher<UpdateOptionsMutation, UpdateOptionsMutationVariables>(client, UpdateOptionsDocument, variables)(),
      options
    );
export const UpdatePlayerDocument = `
    mutation UpdatePlayer($input: UpdatePlayerInput!) {
  updatePlayer(input: $input) {
    id
    name
    tank
    healer
    dps
    locked
    inTheRoll
  }
}
    `;
export const useUpdatePlayerMutation = <
      TError = unknown,
      TContext = unknown
    >(
      client: GraphQLClient, 
      options?: UseMutationOptions<UpdatePlayerMutation, TError, UpdatePlayerMutationVariables, TContext>
    ) => 
    useMutation<UpdatePlayerMutation, TError, UpdatePlayerMutationVariables, TContext>(
      (variables?: UpdatePlayerMutationVariables) => fetcher<UpdatePlayerMutation, UpdatePlayerMutationVariables>(client, UpdatePlayerDocument, variables)(),
      options
    );
export const MeDocument = `
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;
export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables?: MeQueryVariables, 
      options?: UseQueryOptions<MeQuery, TError, TData>
    ) => 
    useQuery<MeQuery, TError, TData>(
      ['Me', variables],
      fetcher<MeQuery, MeQueryVariables>(client, MeDocument, variables),
      options
    );
export const OptionsDocument = `
    query Options {
  options {
    lockAfterOut
    rollType
    theme
  }
}
    `;
export const useOptionsQuery = <
      TData = OptionsQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables?: OptionsQueryVariables, 
      options?: UseQueryOptions<OptionsQuery, TError, TData>
    ) => 
    useQuery<OptionsQuery, TError, TData>(
      ['Options', variables],
      fetcher<OptionsQuery, OptionsQueryVariables>(client, OptionsDocument, variables),
      options
    );
export const PlayerDocument = `
    query Player($id: Float!) {
  player(id: $id) {
    id
    name
    tank
    healer
    dps
    inTheRoll
    locked
  }
}
    `;
export const usePlayerQuery = <
      TData = PlayerQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables: PlayerQueryVariables, 
      options?: UseQueryOptions<PlayerQuery, TError, TData>
    ) => 
    useQuery<PlayerQuery, TError, TData>(
      ['Player', variables],
      fetcher<PlayerQuery, PlayerQueryVariables>(client, PlayerDocument, variables),
      options
    );
export const PlayersDocument = `
    query Players {
  players {
    id
    name
    tank
    healer
    dps
    inTheRoll
    locked
  }
  me {
    username
  }
}
    `;
export const usePlayersQuery = <
      TData = PlayersQuery,
      TError = unknown
    >(
      client: GraphQLClient, 
      variables?: PlayersQueryVariables, 
      options?: UseQueryOptions<PlayersQuery, TError, TData>
    ) => 
    useQuery<PlayersQuery, TError, TData>(
      ['Players', variables],
      fetcher<PlayersQuery, PlayersQueryVariables>(client, PlayersDocument, variables),
      options
    );