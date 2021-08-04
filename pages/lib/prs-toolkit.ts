import { githubClient } from "./graphql/client";
import {
  GetFileContent,
  GetFileContentQuery,
  GetFileContentQueryVariables,
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

type File = {
  refOid: string;
  path: string;
  repositoryName: string;
  repositoryOwner: string;
};

/*
 * TypeScript seems unable to create generated types using Pick without allowing values to be null or undefined.
 * This function recasts everything as the type it is expected to be while ruling out (double checking) the possibility
 * that it, or any parent object, is null or undefined.
 */
function ensurePath<T>(nullishCoalesingPath: T): NonNullable<T> {
  if (nullishCoalesingPath === null || nullishCoalesingPath === undefined) {
    throw new Error("Malformed response");
  } else {
    return nullishCoalesingPath as NonNullable<T>; // Not sure why type narrowing isn't working
  }
}

export class Diff {
  constructor(private oldFile: File, private newFile: File) {}

  private async getFileContent(
    variables: GetFileContentQueryVariables
  ): Promise<string> {
    const response = await githubClient().query<
      GetFileContentQuery,
      GetFileContentQueryVariables
    >({
      query: GetFileContent,
      variables,
    });

    if (response.errors) {
      throw new Error("GetFileContent Query Failed");
    }

    // GraphQL code-gen typing is unreliable for this case
    const blob = (response.data.repository?.object ?? {}) as any;
    return blob["text"] ?? "";
  }

  get oldFileContent(): Promise<string> {
    const oldFile = {
      refOidColonFilePath: `${this.oldFile.refOid}:${this.oldFile.path}`,
      repositoryName: this.oldFile.repositoryName,
      repositoryOwner: this.oldFile.repositoryOwner,
    };

    return this.getFileContent(oldFile);
  }

  get newFileContent(): Promise<string> {
    const newFile = {
      refOidColonFilePath: `${this.newFile.refOid}:${this.newFile.path}`,
      repositoryName: this.newFile.repositoryName,
      repositoryOwner: this.newFile.repositoryOwner,
    };

    return this.getFileContent(newFile);
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
      const path = ensurePath(file?.path);

      const oldFile = {
        repositoryName: variables.repositoryName,
        repositoryOwner: variables.repositoryOwner,
        refOid: pullRequest.baseRefOid,
        path,
      };
      const newFile = {
        repositoryName: variables.repositoryName,
        repositoryOwner: variables.repositoryOwner,
        refOid: pullRequest.headRefOid,
        path,
      };

      return new Diff(oldFile, newFile);
    });
  }
}
