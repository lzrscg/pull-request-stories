/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStory = /* GraphQL */ `
  mutation CreateStory($story: StoryInput!) {
    createStory(story: $story) {
      slug
      title
      pullRequestPath
      content
      publishedAt
      owner
    }
  }
`;
export const deleteStory = /* GraphQL */ `
  mutation DeleteStory($storySlug: String!) {
    deleteStory(storySlug: $storySlug)
  }
`;
export const updateStory = /* GraphQL */ `
  mutation UpdateStory($story: UpdateStoryInput!) {
    updateStory(story: $story) {
      slug
      title
      pullRequestPath
      content
      publishedAt
      owner
    }
  }
`;
