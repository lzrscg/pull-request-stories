import ReactDiffViewer from "react-diff-viewer";

import { IFile } from "../pages/lib/file";

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
  diff: {
    newFile: IFile;
    oldFile: IFile;
    numDiffLines: number;
    url: string;
  }
};

const DiffViewer: React.FC<Props> = function ({ diff }) {
  return (
    <div className="w-full p-5">
      <div className="leading-8 bg-gray-50 p-2 underline rounded-t">
        <pre>
          <a href={diff.url}>{diff.newFile.path}</a>
        </pre>
      </div>
      <div className="relative overflow-x-scroll">
        <ReactDiffViewer
          oldValue={diff.oldFile.content}
          newValue={diff.newFile.content}
          splitView={false}
          renderContent={syntaxHighlight(diff.newFile.language)}
        />
      </div>
    </div>
  );
};

export default DiffViewer;
