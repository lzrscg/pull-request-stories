/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserByUsername = /* GraphQL */ `
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      preferred_username
      picture
      name
    }
  }
`;
export const getStoryBySlug = /* GraphQL */ `
  query GetStoryBySlug($storySlug: String!) {
    getStoryBySlug(storySlug: $storySlug) {
      slug
      title
      pullRequestPath
      content
      publishedAt
      owner
    }
  }
`;
export const listStories = /* GraphQL */ `
  query ListStories {
    listStories {
      slug
      title
      pullRequestPath
      content
      publishedAt
      owner
    }
  }
`;
export const storiesByUsername = /* GraphQL */ `
  query StoriesByUsername {
    storiesByUsername {
      slug
      title
      pullRequestPath
      content
      publishedAt
      owner
    }
  }
`;
