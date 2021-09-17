import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";

export class PullRequestDiff implements IPullRequestDiff {
  public readonly repositoryOwner: string;
  public readonly repositoryName: string;
  public readonly pullRequestNumber: number;
  public readonly path: string;
  public readonly oldFileRefOid: string;
  public readonly newFileRefOid: string;
  public readonly numDiffLines: number;

  constructor(pullRequestDiff: IPullRequestDiff) {
    this.repositoryOwner = pullRequestDiff.repositoryOwner;
    this.repositoryName = pullRequestDiff.repositoryName;
    this.pullRequestNumber = pullRequestDiff.pullRequestNumber;
    this.path = pullRequestDiff.path;
    this.oldFileRefOid = pullRequestDiff.oldFileRefOid;
    this.newFileRefOid = pullRequestDiff.newFileRefOid;
    this.numDiffLines = pullRequestDiff.numDiffLines;
  }

  /**
   * TODO: Reimplement using REST instead of GraphQL so that requests can be made w/o Auth
   * @param variables
   * @returns
   */
  private async _getFileContent(
    repositoryOwner: string,
    repositoryName: string,
    refOid: string,
    path: string
  ): Promise<string> {
    const response = await fetch(
      `https://raw.githubusercontent.com/${repositoryName}/${repositoryOwner}/${refOid}/${path}`
    );

    if (response.status === 404) {
      return "";
    }

    if (response.status !== 200) {
      throw new Error(`Could not fetch ${refOid}/${path}`);
    }

    const content = response.text();

    return content;
  }

  public getOldFileContent(): Promise<string> {
    const { repositoryName, repositoryOwner, oldFileRefOid, path } = this;
    const content = this._getFileContent(
      repositoryName,
      repositoryOwner,
      oldFileRefOid,
      path
    );

    return content;
  }

  public getNewFileContent(): Promise<string> {
    const { repositoryName, repositoryOwner, newFileRefOid, path } = this;
    const content = this._getFileContent(
      repositoryName,
      repositoryOwner,
      newFileRefOid,
      path
    );

    return content;
  }

  public async getUrl(): Promise<string> {
    const { repositoryOwner, repositoryName, pullRequestNumber, path } = this;

    /**
     * TODO: Reimplement using WebCrypto, if running in browser
     */
    const { createHash } = await import("crypto");
    const diffAnchor = createHash("sha256").update(path, "utf8").digest("hex");

    const url = `https://github.com/${repositoryOwner}/${repositoryName}/pull/${pullRequestNumber}/files#diff-${diffAnchor}`;

    return url;
  }

  public toJSON(): IPullRequestDiff {
    const json = {
      repositoryOwner: this.repositoryOwner,
      repositoryName: this.repositoryName,
      pullRequestNumber: this.pullRequestNumber,
      path: this.path,
      oldFileRefOid: this.oldFileRefOid,
      newFileRefOid: this.newFileRefOid,
      numDiffLines: this.numDiffLines,
    };

    return json;
  }
}
