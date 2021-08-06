import { IFile } from "./file";
import PrsToolkit from "./prs-toolkit";

export default async function test(): Promise<
  { newFile: IFile; oldFile: IFile; numDiffLines: number }[]
> {
  // Making a pull request story template from the first pull request returned by GitHub
  const toolkit = new PrsToolkit();
  const pullRequests = await toolkit.listAuthenticatedUsersPullRequests();
  const firstPullRequest = pullRequests[0];
  const diffs = await toolkit.getPullRequestDiffs(firstPullRequest);

  return await Promise.all(
    diffs.map(async (diff) => {
      const newFile = await diff.getNewFile();
      const oldFile = await diff.getOldFile();

      return {
        newFile: newFile.toJSON(),
        oldFile: oldFile.toJSON(),
        numDiffLines: diff.numDiffLines,
      };
    })
  );
}