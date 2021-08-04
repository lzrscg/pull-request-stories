import Head from "next/head";
import ReactDiffViewer from "react-diff-viewer";
import test from "./lib/example";

const P = require("prismjs");

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`;

const syntaxHighlight = (str: string): any => {
  if (!str) return;
  const language = P.highlight(str, P.languages.javascript);
  return <span dangerouslySetInnerHTML={{ __html: language }} />;
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
  diffs: { newFileContent: string; oldFileContent: string }[];
};

const Post: React.FC<Props> = function ({ diffs }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {diffs.map((diff, index) => {
        return (
          <ReactDiffViewer
            key={index}
            oldValue={diff.oldFileContent}
            newValue={diff.newFileContent}
            splitView={false}
            leftTitle="webpack.config.js master@2178133 - pushed 2 hours ago."
            rightTitle="webpack.config.js master@64207ee - pushed 13 hours ago."
            renderContent={syntaxHighlight}
          />
        );
      })}
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={false}
        leftTitle="webpack.config.js master@2178133 - pushed 2 hours ago."
        rightTitle="webpack.config.js master@64207ee - pushed 13 hours ago."
        renderContent={syntaxHighlight}
      />

      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={false}
        leftTitle="webpack.config.js master@2178133 - pushed 2 hours ago."
        rightTitle="webpack.config.js master@64207ee - pushed 13 hours ago."
        renderContent={syntaxHighlight}
      />

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>
        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            pages/index.js
          </code>
        </p>

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
    </div>
  );
};

export default Post;
