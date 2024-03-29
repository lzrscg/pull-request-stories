import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import {
  getPullRequestDiffs,
  listAuthenticatedUsersPullRequests,
} from "./utils";

/*export default async function test(): Promise<IPullRequestDiff[]> {
  // Making a pull request story template from the first pull request returned by GitHub
  const pullRequests = await listAuthenticatedUsersPullRequests();
  const firstPullRequest = pullRequests[0];
  const diffs = await getPullRequestDiffs(firstPullRequest);

  return diffs.map((diff) => diff.toJSON());
}*/

const diffs = [
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: ".gitignore",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 8,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "codegen.yml",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 11,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "index.js",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 18,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "index.ts",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 3,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "package-lock.json",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 5406,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "package.json",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 20,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/example.ts",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 26,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/graphql/client.ts",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 23,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/graphql/generated/github-schema-loader.js",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 2,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/graphql/generated/graphql.ts",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 32162,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/graphql/queries/get-file-content.graphql",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 9,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/graphql/queries/get-pull-request-diffs.graphql",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 14,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/graphql/queries/list-authenticated-users-pull-requests.graphql",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 18,
  },
  {
    repositoryOwner: "lzrscg",
    repositoryName: "git-diff-to-blog-post",
    pullRequestNumber: 1,
    path: "src/lib/prs-toolkit.ts",
    oldFileRefOid: "b1beb8bd86a9bd26ff696e1738cee52ae176ce38",
    newFileRefOid: "9c12aebd4548286848a18547559868acf7d24df3",
    numDiffLines: 134,
  },
];

export default function test(): IPullRequestDiff[] {
  return diffs;
}
