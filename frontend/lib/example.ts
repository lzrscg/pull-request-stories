import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import {
  getPullRequestDiffs,
  listAuthenticatedUsersPullRequests,
} from "./utils";

export default async function test(): Promise<IPullRequestDiff[]> {
  // Making a pull request story template from the first pull request returned by GitHub
  const pullRequests = await listAuthenticatedUsersPullRequests();
  const firstPullRequest = pullRequests[0];
  const diffs = await getPullRequestDiffs(firstPullRequest);

  return diffs.map((diff) => diff.toJSON());
}
