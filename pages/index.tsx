import Head from "next/head";

import PullRequestStory from "../components/pull-request-story";
import { IPullRequestDiff } from "../interfaces/pull-request-diff.interface";
import test from "../lib/example";

const fakeText = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse suscipit diam nec nisi egestas, eu varius dui consequat. Suspendisse non tristique enim, eget pellentesque augue. Nullam ornare sed erat eget feugiat. Sed eu nunc ultrices, dignissim nisi sit amet, convallis purus. Cras ullamcorper consequat molestie. Ut sit amet aliquam risus, quis molestie massa. Phasellus rutrum, risus sit amet ornare lobortis, odio sapien tempor enim, ut fermentum nisl ex ut arcu. Integer sed mi non nulla mollis placerat vitae quis lacus. Praesent odio felis, maximus aliquet diam at, bibendum dictum dolor. Fusce lacinia feugiat vehicula. Donec ullamcorper a eros vel ultricies. Quisque tincidunt nec est laoreet finibus. In quis sollicitudin quam.

Vestibulum accumsan at ante id euismod. Sed ex sem, porta ut ex ac, tincidunt pellentesque velit. Quisque mi metus, mollis at sem eget, molestie euismod ante. Sed sagittis elit nec quam auctor, sit amet maximus velit ornare. Vestibulum ac erat at nibh sagittis dignissim. Sed imperdiet quam sit amet risus lobortis dapibus. Maecenas tincidunt, enim vitae venenatis facilisis, dolor lectus scelerisque lacus, ut luctus nisi turpis gravida velit. Aenean pharetra nisi quis metus vulputate aliquam. Fusce laoreet venenatis nunc.

Donec auctor in est at cursus. Ut nisi nisi, gravida eget sagittis et, aliquam ullamcorper lectus. Duis congue cursus lacinia. Aenean bibendum, justo vitae suscipit iaculis, lorem dui consectetur dolor, eu consectetur lectus orci eu neque. Suspendisse fringilla bibendum venenatis. Sed dictum vel purus nec gravida. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Suspendisse a rutrum augue. Duis et turpis orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse lectus justo, cursus vel nibh sed, imperdiet vulputate dolor. Integer a eros metus. Etiam tellus ante, commodo sit amet tempor eget, semper faucibus nibh. Quisque non euismod nulla. `;

export async function getStaticProps() {
  const diffs = await test();

  return {
    props: {
      diffs,
    },
  };
}

type Props = {
  diffs: IPullRequestDiff[];
};

const Post: React.FC<Props> = function ({ diffs }) {
  const sections = diffs.map((diff) => {
    return {
      heading: `About ${diff.path}`,
      commentary: fakeText,
      diff,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>My First Pull Request - Pull Request Stories</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20">
        <h1 className="text-6xl font-bold text-center">
          My First Pull Request
        </h1>
        <p className="mt-3 text-2xl text-center">By LZRS</p>
        <div className="max-w-4xl">
          <PullRequestStory sections={sections} />
        </div>
      </main>
    </div>
  );
};

export default Post;
