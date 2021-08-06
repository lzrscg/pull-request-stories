import Head from "next/head";
import ReactDiffViewer from "react-diff-viewer";

import test from "./lib/example";
import File from "./lib/file";

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

export async function getStaticProps() {
  const diffs = await test();

  return {
    props: {
      diffs,
    },
  };
}

type Props = {
  diffs: {
    newFile: File;
    oldFile: File;
    numDiffLines: number;
  }[];
};

const Post: React.FC<Props> = function ({ diffs }) {
  return (
    <div>
      {diffs
        .filter((diff) => diff.numDiffLines < 100)
        .map((diff, index) => {
          return (
            <div key={index} className="relative overflow-x-scroll max-w-3xl">
              {/** TODO: fix absolute scrolling issue and long file paths */}
              <a href={diff.oldFile.url} className="absolute right-0">
                <img
                  src="/github.png"
                  alt="View Source on GitHub"
                  className="h-12 w-12 p-3"
                />
              </a>
              <ReactDiffViewer
                oldValue={diff.oldFile.content}
                newValue={diff.newFile.content}
                splitView={false}
                leftTitle={diff.newFile.path}
                renderContent={syntaxHighlight(diff.newFile.language)}
              />
            </div>
          );
        })}
    </div>
    /*<div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20">
        <h1 className="text-6xl font-bold text-center">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>
        <p className="mt-3 text-2xl text-center">
          Get started by editing{" "}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            pages/index.js
          </code>
        </p>
        {diffs
          .filter((diff) => diff.numDiffLines < 100)
          .map((diff, index) => {
            return (
              <div key={index} className="overflow-x-scroll max-w-lg bg-gray-100">
                <p>hello world</p>
                <ReactDiffViewer
                  oldValue={diff.oldFile.content}
                  newValue={diff.newFile.content}
                  splitView={false}
                  leftTitle={diff.newFile.name}
                  renderContent={syntaxHighlight(diff.newFile.language)}
                />
              </div>
            );
          })}
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
            <p className="mt-4 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
            <p className="mt-4 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>*/
  );
};

export default Post;
