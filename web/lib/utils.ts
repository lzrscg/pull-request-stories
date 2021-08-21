import { PullRequestDiff } from "../classes/pull-request-diff";
import { githubClient } from "../graphql/client";
import {
  GetPullRequestDiffs,
  GetPullRequestDiffsQuery,
  GetPullRequestDiffsQueryVariables,
  ListAuthenticatedUsersPullRequests,
  ListAuthenticatedUsersPullRequestsQuery,
} from "../graphql/generated/graphql";
import { IPullRequest } from "../interfaces/pull-request.interface";

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

function stringFromPathAfterLastOccuranceOfSubstring(
  path: string,
  substring: string
): string | null {
  const partsOfPath = path.split(substring);
  const numberOfParts = partsOfPath.length;

  if (numberOfParts === 1) {
    return null;
  }

  const lastPartOfPath = partsOfPath[numberOfParts - 1];

  return lastPartOfPath;
}

export async function listAuthenticatedUsersPullRequests(): Promise<
  IPullRequest[]
> {
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

export async function getPullRequestDiffs(
  variables: GetPullRequestDiffsQueryVariables
): Promise<PullRequestDiff[]> {
  const response = await githubClient().query<GetPullRequestDiffsQuery>({
    query: GetPullRequestDiffs,
    variables,
  });
  if (response.errors) {
    throw new Error("GetPullRequestDiffs Query Failed");
  }

  const pullRequest = ensurePath(response.data.repository?.pullRequest);
  const files = ensurePath(response.data.repository?.pullRequest?.files?.nodes);

  return files.map((file) => {
    const { path, additions, deletions } = ensurePath(file);
    const numDiffLines = additions + deletions;
    const pullRequestDiffParams = {
      repositoryName: variables.repositoryName,
      repositoryOwner: variables.repositoryOwner,
      pullRequestNumber: variables.pullRequestNumber,
      oldFileRefOid: pullRequest.baseRefOid,
      newFileRefOid: pullRequest.headRefOid,
      path,
      numDiffLines,
    };

    return new PullRequestDiff(pullRequestDiffParams);
  });
}

export function getLanguageFromFilePath(path: string): string | null {
  const extensionOrNullIfNoExtension =
    stringFromPathAfterLastOccuranceOfSubstring(path, ".");

  return extensionOrNullIfNoExtension;
}

export function getNameFromFilePath(path: string): string {
  const nameOrNullIfPathIsName = stringFromPathAfterLastOccuranceOfSubstring(
    path,
    "/"
  );

  if (nameOrNullIfPathIsName === null) {
    return path;
  }

  const name = nameOrNullIfPathIsName;

  return name;
}
