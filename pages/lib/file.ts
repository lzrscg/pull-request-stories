import { sha256 } from 'js-sha256';

export type FileMetadata = {
  refOid: string;
  path: string;
  repositoryName: string;
  repositoryOwner: string;
};

/**
 * TODO: Reimplement using substring because it is more readable than regex
 */
function stringFromPathAfterLastOccuranceOfSubstring(
  path: string,
  substring: string
): string | null {
  const REGEX_MATCH_GROUP_NAME = "extractedString";
  const stringAfterLastSubstring = new RegExp(
    `[^^]${substring}(?<${REGEX_MATCH_GROUP_NAME}>[^${substring}]+)$`
  );
  const extractedStringOrNullIfNotFound = path.match(stringAfterLastSubstring);

  if (
    extractedStringOrNullIfNotFound === null ||
    extractedStringOrNullIfNotFound.groups === undefined
  ) {
    return null;
  }

  const extractedString =
    extractedStringOrNullIfNotFound.groups[REGEX_MATCH_GROUP_NAME];
  return extractedString;
}

export interface IFile {
  content: string;
  url: string;
  name: string;
  path: string;
  language: string | null;
}

export default class File implements IFile {
  constructor(private _content: string, private _metadata: FileMetadata) {}

  get content(): string {
    return this._content;
  }

  get url(): string {
    const { repositoryOwner, repositoryName, refOid, path } = this._metadata;
    return `https://github.com/${repositoryOwner}/${repositoryName}/blob/${refOid}/${path}`;
  }

  get name(): string {
    const path = this._metadata.path;
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

  get path(): string {
    return this._metadata.path;
  }

  get language(): string | null {
    const path = this._metadata.path;
    const extensionOrNullIfNoExtension =
      stringFromPathAfterLastOccuranceOfSubstring(path, ".");

    return extensionOrNullIfNoExtension;
  }

  public toJSON(): IFile {
    const json = {
      content: this.content,
      url: this.url,
      name: this.name,
      path: this.path,
      language: this.language,
    };

    return json;
  }
}
