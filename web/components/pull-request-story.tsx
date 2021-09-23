import ReactMarkdown from "react-markdown";

import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import PullRequestDiffViewer from "./pull-request-diff-viewer";

type Props = {
  markdown: string;
};

const PullRequestStory: React.FC<Props> = function ({ markdown }) {
  const jsx = Array.from(markdown.matchAll(/<PullRequestDiff.+\/>/g));
  const prose = markdown.split(/<PullRequestDiff.+\/>/g);

  const markdownSections = [
    ...(jsx.length
      ? jsx.reduce((prev, cur, index) => {
          if (markdown.search(/<PullRequestDiff.+\/>/) === 0) {
            return [...prev, cur[0], prose[index]];
          } else {
            return [...prev, prose[index], cur[0]];
          }
        }, [])
      : []),
    prose[prose.length - 1],
  ];

  const markdownWithJSX = markdownSections.map((section, index) => {
    if (section.match(/<PullRequestDiff.+\/>/)) {
      const repositoryOwner =
        /repositoryOwner="(?<repositoryOwner>[^"]+)"/g.exec(section)?.groups
          ?.repositoryOwner;
      const repositoryName = /repositoryName="(?<repositoryName>[^"]+)"/g.exec(
        section
      )?.groups?.repositoryName;
      const pullRequestNumber =
        /pullRequestNumber="(?<pullRequestNumber>[^"]+)"/g.exec(section)?.groups
          ?.pullRequestNumber;
      const path = /path="(?<path>[^"]+)"/g.exec(section)?.groups?.path;
      const newFileRefOid = /newFileRefOid="(?<newFileRefOid>[^"]+)"/g.exec(
        section
      )?.groups?.newFileRefOid;
      const oldFileRefOid = /oldFileRefOid="(?<oldFileRefOid>[^"]+)"/g.exec(
        section
      )?.groups?.oldFileRefOid;
      const numDiffLines = /numDiffLines="(?<numDiffLines>[^"]+)"/g.exec(
        section
      )?.groups?.numDiffLines;
      if (
        repositoryOwner &&
        repositoryName &&
        pullRequestNumber &&
        !Number.isNaN(Number(pullRequestNumber)) &&
        path &&
        oldFileRefOid &&
        newFileRefOid &&
        numDiffLines &&
        !Number.isNaN(Number(numDiffLines))
      ) {
        const diff: IPullRequestDiff = {
          repositoryOwner,
          repositoryName,
          pullRequestNumber: Number(pullRequestNumber),
          path,
          oldFileRefOid,
          newFileRefOid,
          numDiffLines: Number(numDiffLines),
        };
        return <PullRequestDiffViewer diff={diff} key={index} />;
      } else {
        return null;
      }
    } else {
      return (
        <div className="prose" key={index}>
          <ReactMarkdown>{section}</ReactMarkdown>
        </div>
      );
    }
  });
  return <div>{markdownWithJSX}</div>;
};

export default PullRequestStory;
