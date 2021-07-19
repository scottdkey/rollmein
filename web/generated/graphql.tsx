import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  input?: Maybe<PlayerInput>;
  id: Scalars['Float'];
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
  id: Scalars['ID'];
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
  options?: Maybe<Options>;
};


export type QueryPlayerArgs = {
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
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type CreatePlayerMutationVariables = Exact<{
  input: PlayerInput;
}>;


export type CreatePlayerMutation = (
  { __typename?: 'Mutation' }
  & { createPlayer: (
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'name' | 'tank' | 'healer' | 'dps' | 'locked'>
  ) }
);

export type DeletePlayerMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeletePlayerMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePlayer'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type UpdateOptionsMutationVariables = Exact<{
  input: OptionsInput;
}>;


export type UpdateOptionsMutation = (
  { __typename?: 'Mutation' }
  & { updateOptions?: Maybe<(
    { __typename?: 'Options' }
    & Pick<Options, 'lockAfterOut' | 'rollType' | 'theme'>
  )> }
);

export type UpdatePlayerMutationVariables = Exact<{
  id: Scalars['Float'];
  input: PlayerInput;
}>;


export type UpdatePlayerMutation = (
  { __typename?: 'Mutation' }
  & { updatePlayer?: Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'name' | 'tank' | 'healer' | 'dps' | 'locked'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type OptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type OptionsQuery = (
  { __typename?: 'Query' }
  & { options?: Maybe<(
    { __typename?: 'Options' }
    & Pick<Options, 'lockAfterOut' | 'rollType' | 'theme'>
  )> }
);

export type PlayerQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type PlayerQuery = (
  { __typename?: 'Query' }
  & { player?: Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'name' | 'tank' | 'healer' | 'dps' | 'inTheRoll' | 'locked'>
  )> }
);

export type PlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayersQuery = (
  { __typename?: 'Query' }
  & { players: Array<(
    { __typename?: 'Player' }
    & Pick<Player, 'id' | 'name' | 'tank' | 'healer' | 'dps' | 'inTheRoll' | 'locked'>
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePlayerDocument = gql`
    mutation CreatePlayer($input: PlayerInput!) {
  createPlayer(input: $input) {
    id
    name
    tank
    healer
    dps
    locked
  }
}
    `;

export function useCreatePlayerMutation() {
  return Urql.useMutation<CreatePlayerMutation, CreatePlayerMutationVariables>(CreatePlayerDocument);
};
export const DeletePlayerDocument = gql`
    mutation DeletePlayer($id: Float!) {
  deletePlayer(id: $id)
}
    `;

export function useDeletePlayerMutation() {
  return Urql.useMutation<DeletePlayerMutation, DeletePlayerMutationVariables>(DeletePlayerDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateOptionsDocument = gql`
    mutation UpdateOptions($input: OptionsInput!) {
  updateOptions(input: $input) {
    lockAfterOut
    rollType
    theme
  }
}
    `;

export function useUpdateOptionsMutation() {
  return Urql.useMutation<UpdateOptionsMutation, UpdateOptionsMutationVariables>(UpdateOptionsDocument);
};
export const UpdatePlayerDocument = gql`
    mutation UpdatePlayer($id: Float!, $input: PlayerInput!) {
  updatePlayer(id: $id, input: $input) {
    id
    name
    tank
    healer
    dps
    locked
  }
}
    `;

export function useUpdatePlayerMutation() {
  return Urql.useMutation<UpdatePlayerMutation, UpdatePlayerMutationVariables>(UpdatePlayerDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const OptionsDocument = gql`
    query Options {
  options {
    lockAfterOut
    rollType
    theme
  }
}
    `;

export function useOptionsQuery(options: Omit<Urql.UseQueryArgs<OptionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<OptionsQuery>({ query: OptionsDocument, ...options });
};
export const PlayerDocument = gql`
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

export function usePlayerQuery(options: Omit<Urql.UseQueryArgs<PlayerQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlayerQuery>({ query: PlayerDocument, ...options });
};
export const PlayersDocument = gql`
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
}
    `;

export function usePlayersQuery(options: Omit<Urql.UseQueryArgs<PlayersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PlayersQuery>({ query: PlayersDocument, ...options });
};