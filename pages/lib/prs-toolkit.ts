import { Diff } from "./diff";
import { githubClient } from "./graphql/client";
import {
  GetPullRequestDiffs,
  GetPullRequestDiffsQuery,
  GetPullRequestDiffsQueryVariables,
  ListAuthenticatedUsersPullRequests,
  ListAuthenticatedUsersPullRequestsQuery,
} from "./graphql/generated/graphql";

type PullRequest = {
  repositoryOwner: string;
  repositoryName: string;
  pullRequestNumber: number;
};

/*
 * TypeScript seems unable to create generated types using Pick without allowing values to be null or undefined.
 * This function recasts everything as the type it is expected to be while ruling out (double checking) the possibility
 * that it, or any parent object, is null or undefined.
 */
function ensurePath<T>(optionalChainedPath: T): NonNullable<T> {
  if (optionalChainedPath === null || optionalChainedPath === undefined) {
    throw new Error("Malformed response");
  } else {
    return optionalChainedPath as NonNullable<T>; // Not sure why type narrowing isn't working
  }
}

export default class PrsToolkit {
  public async listAuthenticatedUsersPullRequests(): Promise<PullRequest[]> {
    const response =
      await githubClient().query<ListAuthenticatedUsersPullRequestsQuery>({
        query: ListAuthenticatedUsersPullRequests,
      });
    if (response.errors) {
      throw new Error("ListAuthenticatedUsersPullRequests Query Failed");
    }

    const pullRequests = ensurePath(response.data.viewer?.pullRequests?.nodes);

    return pullRequests
      .filter((pullRequest) => {
        const isPrivate = ensurePath(pullRequest?.repository?.isPrivate);

        return !isPrivate;
      })
      .map((pullRequest) => {
        const login = ensurePath(pullRequest?.repository?.owner?.login);
        const name = ensurePath(pullRequest?.repository?.name);
        const number = ensurePath(pullRequest?.number);

        return {
          repositoryOwner: login,
          repositoryName: name,
          pullRequestNumber: number,
        };
      });
  }

  public async getPullRequestDiffs(
    variables: GetPullRequestDiffsQueryVariables
  ): Promise<Diff[]> {
    const response = await githubClient().query<GetPullRequestDiffsQuery>({
      query: GetPullRequestDiffs,
      variables,
    });
    if (response.errors) {
      throw new Error("GetPullRequestDiffs Query Failed");
    }

    const pullRequest = ensurePath(response.data.repository?.pullRequest);
    const files = ensurePath(
      response.data.repository?.pullRequest?.files?.nodes
    );

    return files.map((file) => {
      const { path, additions, deletions } = ensurePath(file);
      const numDiffLines = additions + deletions;
      const oldFileMetadata = {
        repositoryName: variables.repositoryName,
        repositoryOwner: variables.repositoryOwner,
        refOid: pullRequest.baseRefOid,
        path,
      };
      const newFileMetadata = {
        repositoryName: variables.repositoryName,
        repositoryOwner: variables.repositoryOwner,
        refOid: pullRequest.headRefOid,
        path,
      };

      return new Diff(oldFileMetadata, newFileMetadata, numDiffLines);
    });
  }
}
