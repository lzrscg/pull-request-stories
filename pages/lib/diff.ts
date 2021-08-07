import File, { FileMetadata } from "./file";
import { githubClient } from "./graphql/client";
import {
  GetFileContent,
  GetFileContentQuery,
  GetFileContentQueryVariables,
} from "./graphql/generated/graphql";

export class GitHubDiff {
  constructor(
    private _oldFileMetadata: FileMetadata,
    private _newFileMetadata: FileMetadata,
    private _numDiffLines: number
  ) {}

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

  public async getOldFile(): Promise<File> {
    const queryParameters = {
      refOidColonFilePath: `${this._oldFileMetadata.refOid}:${this._oldFileMetadata.path}`,
      repositoryName: this._oldFileMetadata.repositoryName,
      repositoryOwner: this._oldFileMetadata.repositoryOwner,
    };
    const content = await this.getFileContent(queryParameters);
    const file = new File(content, this._oldFileMetadata);

    return file;
  }

  public async getNewFile(): Promise<File> {
    const queryParameters = {
      refOidColonFilePath: `${this._newFileMetadata.refOid}:${this._newFileMetadata.path}`,
      repositoryName: this._newFileMetadata.repositoryName,
      repositoryOwner: this._newFileMetadata.repositoryOwner,
    };
    const content = await this.getFileContent(queryParameters);
    const file = new File(content, this._newFileMetadata);

    return file;
  }

  public async getUrl(): Promise<string> {
    const { repositoryOwner, repositoryName, path } = this._newFileMetadata;
    const newFileRefOid = this._newFileMetadata.refOid;
    const oldFileRefOid = this._oldFileMetadata.refOid;

    const { createHash } = await import("crypto");
    const diffAnchor = createHash("sha256").update(path, "utf8").digest('hex');
    /*const encoder = new TextEncoder();
    const utf8EncodedPath = encoder.encode(path);
    const diffAnchor = await window.crypto.subtle.digest(
      "SHA-256",
      utf8EncodedPath
    );*/

    const url = `https://github.com/${repositoryOwner}/${repositoryName}/compare/${oldFileRefOid}...${newFileRefOid}#diff-${diffAnchor}`;

    return url;
  }

  get numDiffLines(): number {
    return this._numDiffLines;
  }
}
