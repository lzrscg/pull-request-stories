import { useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";

import { PullRequestDiff } from "../classes/pull-request-diff";
import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import { getLanguageFromFilePath } from "../lib/utils";

const P = require("prismjs");
const loadLanguages = require("prismjs/components/");

const syntaxHighlight = (language: string | null): any => {
  return (str: string) => {
    if (!str) return;

    try {
      loadLanguages([language]);
    } catch {
      console.log(language, "module not found");
      return str;
    }

    const languageNotSupported = P.languages[language] === undefined;
    if (languageNotSupported) {
      console.log(language, "not supported");
      return str;
    }

    // If language not detected
    if (language === null) {
      return str;
    }

    const highlightedSyntaxHTML = P.highlight(str, P.languages[language]);
    return <span dangerouslySetInnerHTML={{ __html: highlightedSyntaxHTML }} />;
  };
};

type Props = {
  diff: IPullRequestDiff;
};

const PullRequestDiffViewer: React.FC<Props> = function ({ diff }) {
  const [newFileContent, setNewFileContent] = useState<string | null>(null);
  const [oldFileContent, setOldFileContent] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const pullRequestDiff = new PullRequestDiff(diff);

    pullRequestDiff
      .getNewFileContent()
      .then((content) => setNewFileContent(content));
    pullRequestDiff
      .getOldFileContent()
      .then((content) => setOldFileContent(content));
    pullRequestDiff.getUrl().then((url) => setUrl(url));
  });

  if (!newFileContent || !oldFileContent) {
    return (
      <div className="leading-8 bg-gray-50 p-2 rounded">
        Loading diff inline...{" "}
        {url ? <a href={url}>Click here to it view on GitHub.</a> : null}
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="leading-8 bg-gray-50 p-2 underline rounded-t">
        <pre>
          <a ref={url}>{diff.path}</a>
        </pre>
      </div>
      <div className="relative overflow-x-scroll">
        <ReactDiffViewer
          oldValue={oldFileContent}
          newValue={newFileContent}
          splitView={false}
          renderContent={syntaxHighlight(getLanguageFromFilePath(diff.path))}
        />
      </div>
    </div>
  );
};

export default PullRequestDiffViewer;
