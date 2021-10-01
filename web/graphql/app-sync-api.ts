/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type StoryInput = {
  slug: string,
  title: string,
  pullRequestPath?: string | null,
  content: string,
};

export type Story = {
  __typename: "Story",
  slug: string,
  title: string,
  pullRequestPath?: string | null,
  content: string,
  publishedAt: string,
  owner: string,
};

export type UpdateStoryInput = {
  slug: string,
  title?: string | null,
  pullRequestPath?: string | null,
  content?: string | null,
};

export type User = {
  __typename: "User",
  preferred_username?: string | null,
  picture?: string | null,
  name?: string | null,
};

export type CreateStoryMutationVariables = {
  story: StoryInput,
};

export type CreateStoryMutation = {
  createStory?:  {
    __typename: "Story",
    slug: string,
    title: string,
    pullRequestPath?: string | null,
    content: string,
    publishedAt: string,
    owner: string,
  } | null,
};

export type DeleteStoryMutationVariables = {
  storySlug: string,
};

export type DeleteStoryMutation = {
  deleteStory?: string | null,
};

export type UpdateStoryMutationVariables = {
  story: UpdateStoryInput,
};

export type UpdateStoryMutation = {
  updateStory?:  {
    __typename: "Story",
    slug: string,
    title: string,
    pullRequestPath?: string | null,
    content: string,
    publishedAt: string,
    owner: string,
  } | null,
};

export type GetUserByUsernameQueryVariables = {
  username: string,
};

export type GetUserByUsernameQuery = {
  getUserByUsername?:  {
    __typename: "User",
    preferred_username?: string | null,
    picture?: string | null,
    name?: string | null,
  } | null,
};

export type GetStoryBySlugQueryVariables = {
  storySlug: string,
};

export type GetStoryBySlugQuery = {
  getStoryBySlug?:  {
    __typename: "Story",
    slug: string,
    title: string,
    pullRequestPath?: string | null,
    content: string,
    publishedAt: string,
    owner: string,
  } | null,
};

export type ListStoriesQuery = {
  listStories?:  Array< {
    __typename: "Story",
    slug: string,
    title: string,
    pullRequestPath?: string | null,
    content: string,
    publishedAt: string,
    owner: string,
  } | null > | null,
};

export type StoriesByUsernameQuery = {
  storiesByUsername?:  Array< {
    __typename: "Story",
    slug: string,
    title: string,
    pullRequestPath?: string | null,
    content: string,
    publishedAt: string,
    owner: string,
  } | null > | null,
};

export type OnCreateStorySubscription = {
  onCreateStory?:  {
    __typename: "Story",
    slug: string,
    title: string,
    pullRequestPath?: string | null,
    content: string,
    publishedAt: string,
    owner: string,
  } | null,
};
