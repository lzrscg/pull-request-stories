import "../configureAmplify";

import Head from "next/head";
import Link from "next/link";

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

  const headerNavLinks = ["Mission", "Waitlist"];

  return (
    <div className="antialiased max-w-3xl px-4 mx-auto sm:px-6 xl:max-w-5xl xl:px-0">
      <Head>
        <title>My First Pull Request - Pull Request Stories</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col justify-between h-screen">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/">
              <div className="flex items-center justify-between">
                <div className="hidden h-6 text-2xl font-semibold sm:block">
                  Pull Request Stories
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link key={link} href={`/${link}`}>
                  <a className="p-1 font-medium text-gray-900 sm:p-4">{link}</a>
                </Link>
              ))}
            </div>
            {/*<MobileNav />*/}
          </div>
        </header>
        <main className="mb-auto">
          <article>
            <div className="xl:divide-y xl:divide-gray-200">
              <header className="pt-6 xl:pb-6">
                <div className="space-y-1 text-center">
                  <dl className="space-y-10">
                    <div>
                      <dd className="text-base font-medium leading-6 text-gray-500">
                        <time>January 1, 2021</time>
                      </dd>
                    </div>
                  </dl>
                  <div>
                    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                      My First Pull Request
                    </h1>
                  </div>
                </div>
              </header>
              <div
                className="pb-8 divide-y divide-gray-200 xl:divide-y-0 xl:grid xl:grid-cols-4 xl:gap-x-6"
                style={{ gridTemplateRows: "auto 1fr" }}
              >
                <dl className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200">
                  <dd>By LZRS</dd>
                </dl>
                <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
                  <div className="pt-10 pb-8 max-w-none">
                    <PullRequestStory sections={sections} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default Post;
