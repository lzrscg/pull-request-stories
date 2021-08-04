import PrsToolkit from "./prs-toolkit";

export default async function test(): Promise<{newFileContent:string, oldFileContent:string}[]> {
  // Making a pull request story template from the first pull request returned by GitHub
  const toolkit = new PrsToolkit();
  const pullRequests = await toolkit.listAuthenticatedUsersPullRequests();
  const firstPullRequest = pullRequests[0];
  const diffs = await toolkit.getPullRequestDiffs(firstPullRequest);
  
  return await Promise.all(diffs.map(async(diff) => {
    const newFileContent = await diff.newFileContent;
    const oldFileContent = await diff.oldFileContent;

    return {
      newFileContent,
      oldFileContent,
    }
  }));
}