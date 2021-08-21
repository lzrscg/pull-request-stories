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
            <section key={diff.path} className="pb-10">
              <span className="prose">
                <h2>{heading}</h2>
              </span>
              <PullRequestDiffViewer diff={diff} />
              <span className="prose">
                <p>{commentary}</p>
              </span>
            </section>
          );
        })}
    </div>
  );
};

export default PullRequestStory;
