import { IPullRequest } from "./pull-request.interface";

export interface IPullRequestDiff extends IPullRequest {
  path: string;
  oldFileRefOid: string;
  newFileRefOid: string;
  numDiffLines: number;
}
