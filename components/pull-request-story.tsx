import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import PullRequestDiffViewer from "./pull-request-diff-viewer";

type Props = {
  sections: {
    heading: string;
    commentary: string;
    diff: IPullRequestDiff;
  }[];
};

const PullRequestStory: React.FC<Props> = function ({ sections }) {
  return (
    <div>
      {sections
        .filter((section) => section.diff.numDiffLines < 100)
        .map((section) => {
          const { heading, commentary, diff } = section;
          return (
            <div key={diff.path} className="pb-10">
              <h2 className="text-4xl">{heading}</h2>
              <PullRequestDiffViewer diff={diff} />
              <p>{commentary}</p>
            </div>
          );
        })}
    </div>
  );
};

export default PullRequestStory;
