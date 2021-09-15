import "../configureAmplify";

import { API } from "aws-amplify";
import { parseExtendedISODate } from "aws-date-utils";
import Head from "next/head";
import Link from "next/link";

import { listStories } from "../graphql/app-sync/queries";

export async function getServerSideProps() {
  const storyData: any = await API.graphql({ query: listStories });
  const stories = storyData.data.listStories;
  return {
    props: {
      stories,
    },
  };
}

type Props = {
  stories: any[];
};

const Post: React.FC<Props> = function ({ stories }) {
  type NavLink = {
    text: string;
    href: string;
  };
  const headerNavLinks: NavLink[] = [
    {
      text: "Create a Story",
      href: "/new",
    },
  ];

  return (
    <div className="antialiased max-w-3xl px-4 mx-auto sm:px-6 xl:max-w-5xl xl:px-0">
      <Head>
        <title>Pull Request Stories</title>
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
                <Link key={link.href} href={link.href}>
                  <a className="p-1 font-medium text-gray-900 sm:p-4">
                    {link.text}
                  </a>
                </Link>
              ))}
            </div>
            {/*<MobileNav />*/}
          </div>
        </header>
        <main className="mb-auto">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                Latest
              </h1>
              <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
                Stories about code and people
              </p>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {!stories.length && "No posts found."}
              {stories.slice(0, 10).map((story: any) => {
                const { slug, publishedAt, pullRequestPath, title } = story;
                const [repositoryOwner, repositoryName] =
                  pullRequestPath.split("/");
                return (
                  <li key={slug} className="py-12">
                    <article>
                      <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time>
                              {parseExtendedISODate(
                                publishedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </dd>
                        </dl>
                        <div className="space-y-5 xl:col-span-3">
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                                <Link href={`/story/${slug}`}>{title}</Link>
                              </h2>
                            </div>
                            <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                              This story is about contributing to{" "}
                              {repositoryName}, which is a repo created by{" "}
                              {repositoryOwner}.
                            </div>
                          </div>
                          <div className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <Link
                              href={`/story/${slug}`}
                              aria-label={`Read "${title}"`}
                            >
                              Read more &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Post;
